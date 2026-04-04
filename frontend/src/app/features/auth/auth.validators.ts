import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PASSWORD_RULES = [
  'At least 8 characters',
  'At least 1 uppercase letter',
  'At least 1 lowercase letter',
  'At least 1 number',
  'At least 1 special character',
];

const STRONG_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null | undefined;
    if (!value) {
      return null;
    }
    return STRONG_PASSWORD_PATTERN.test(value) ? null : { strongPassword: true };
  };
}

export function matchingFieldsValidator(firstField: string, secondField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const first = control.get(firstField)?.value;
    const second = control.get(secondField)?.value;
    if (!first || !second) {
      return null;
    }
    return first === second ? null : { fieldsMismatch: true };
  };
}
