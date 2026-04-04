import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/material/form-field";
import * as i4 from "@angular/material/input";
function OtpInputComponent_div_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 3);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.errorText);
} }
export class OtpInputComponent {
    control;
    label = 'OTP';
    placeholder = 'Enter 6-digit code';
    errorText = 'Enter a valid 6-digit OTP.';
    get invalid() {
        return this.control.invalid && (this.control.dirty || this.control.touched);
    }
    static ɵfac = function OtpInputComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || OtpInputComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: OtpInputComponent, selectors: [["app-otp-input"]], inputs: { control: "control", label: "label", placeholder: "placeholder", errorText: "errorText" }, decls: 5, vars: 6, consts: [["appearance", "outline", 1, "theme-field"], ["matInput", "", "inputmode", "numeric", "maxlength", "6", 3, "placeholder", "formControl"], ["class", "field-help error", 4, "ngIf"], [1, "field-help", "error"]], template: function OtpInputComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "mat-form-field", 0)(1, "mat-label");
            i0.ɵɵtext(2);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(3, "input", 1);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(4, OtpInputComponent_div_4_Template, 2, 1, "div", 2);
        } if (rf & 2) {
            i0.ɵɵclassProp("invalid-field", ctx.invalid);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance();
            i0.ɵɵproperty("placeholder", ctx.placeholder)("formControl", ctx.control);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.invalid);
        } }, dependencies: [CommonModule, i1.NgIf, ReactiveFormsModule, i2.DefaultValueAccessor, i2.NgControlStatus, i2.MaxLengthValidator, i2.FormControlDirective, MatFormFieldModule, i3.MatFormField, i3.MatLabel, MatInputModule, i4.MatInput], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(OtpInputComponent, [{
        type: Component,
        args: [{
                standalone: true,
                selector: 'app-otp-input',
                imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
                template: `
    <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="invalid">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        inputmode="numeric"
        maxlength="6"
        [placeholder]="placeholder"
        [formControl]="control"
      />
    </mat-form-field>
    <div class="field-help error" *ngIf="invalid">{{ errorText }}</div>
  `,
            }]
    }], null, { control: [{
            type: Input,
            args: [{ required: true }]
        }], label: [{
            type: Input
        }], placeholder: [{
            type: Input
        }], errorText: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(OtpInputComponent, { className: "OtpInputComponent", filePath: "src/app/features/auth/components/otp-input.component.ts", lineNumber: 25 }); })();
//# sourceMappingURL=otp-input.component.js.map