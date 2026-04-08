from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import OTPRequest, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "full_name", "role")


class UserAdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, required=False)

    class Meta:
        model = User
        fields = (
            "id",
            "full_name",
            "email",
            "password",
            "role",
            "is_active",
            "is_superuser",
        )
        extra_kwargs = {
            "is_superuser": {"required": False},
            "is_active": {"required": False},
            "role": {"required": False},
        }

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        role = validated_data.get("role", User.Role.CUSTOMER)
        email = validated_data.get("email")
        user = User(
            username=email,
            email=email,
            full_name=validated_data.get("full_name", ""),
            role=role,
            is_active=validated_data.get("is_active", True),
            is_superuser=validated_data.get("is_superuser", False),
        )
        if password:
            user.set_password(password)
        else:
            user.set_password(User.objects.make_random_password())
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        if "full_name" in validated_data:
            instance.full_name = validated_data["full_name"]
        if "email" in validated_data:
            instance.email = validated_data["email"]
            instance.username = validated_data["email"]
        if "role" in validated_data:
            instance.role = validated_data["role"]
        if "is_active" in validated_data:
            instance.is_active = validated_data["is_active"]
        if "is_superuser" in validated_data:
            instance.is_superuser = validated_data["is_superuser"]
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("email", "full_name")

    def validate_email(self, value: str) -> str:
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def update(self, instance, validated_data):
        instance.email = validated_data.get("email", instance.email)
        instance.full_name = validated_data.get("full_name", instance.full_name)
        instance.username = instance.email
        instance.save(update_fields=["email", "full_name", "username"])
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("full_name", "email", "password", "role")
        extra_kwargs = {"role": {"required": False}}

    def validate_password(self, value: str) -> str:
        validate_password(value)
        return value

    def create(self, validated_data):
        role = validated_data.get("role", User.Role.CUSTOMER)
        email = validated_data["email"]
        full_name = validated_data["full_name"]
        user = User(
            username=email,
            email=email,
            full_name=full_name,
            role=role if role in User.Role.values else User.Role.CUSTOMER,
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class LoginStartSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs["email"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")
        attrs["user"] = user
        return attrs


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)
    purpose = serializers.ChoiceField(choices=OTPRequest.Purpose.choices)

    def validate_email(self, value: str) -> str:
        return value.strip().lower()

    def validate_otp_code(self, value: str) -> str:
        return value.strip()

    def validate(self, attrs):
        latest_request = (
            OTPRequest.objects.filter(
                email=attrs["email"],
                purpose=attrs["purpose"],
                is_verified=False,
            )
            .order_by("-created_at")
            .first()
        )
        if not latest_request:
            raise serializers.ValidationError("OTP request not found.")

        otp_request = (
            OTPRequest.objects.filter(
                email=attrs["email"],
                purpose=attrs["purpose"],
                otp_code=attrs["otp_code"],
                is_verified=False,
            )
            .order_by("-created_at")
            .first()
        )

        if otp_request:
            if otp_request.is_expired:
                raise serializers.ValidationError("OTP has expired.")
            if otp_request.attempts >= 5:
                raise serializers.ValidationError("Too many OTP attempts. Request a new OTP.")
            attrs["otp_request"] = otp_request
            return attrs

        if latest_request.is_expired:
            raise serializers.ValidationError("OTP has expired.")
        if latest_request.attempts >= 5:
            raise serializers.ValidationError("Too many OTP attempts. Request a new OTP.")
        latest_request.attempts += 1
        latest_request.save(update_fields=["attempts"])
        raise serializers.ValidationError("Invalid OTP.")


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value: str) -> str:
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value: str) -> str:
        validate_password(value)
        return value

    def validate_email(self, value: str) -> str:
        return value.strip().lower()

    def validate_otp_code(self, value: str) -> str:
        return value.strip()

    def validate(self, attrs):
        serializer = OTPVerifySerializer(
            data={
                "email": attrs["email"],
                "otp_code": attrs["otp_code"],
                "purpose": OTPRequest.Purpose.PASSWORD_RESET,
            }
        )
        serializer.is_valid(raise_exception=True)
        attrs["otp_request"] = serializer.validated_data["otp_request"]
        return attrs


class AuthTokenSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()

    @staticmethod
    def build_response(user: User) -> dict:
        refresh = RefreshToken.for_user(user)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data,
        }
