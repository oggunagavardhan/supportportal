import { CommonModule } from '@angular/common';
import { Component, Input, ViewChildren, QueryList, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-otp-input',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="otp-container">
      <label class="otp-label">{{ label }}</label>
      <div class="otp-boxes">
        <input
          #otpInput
          *ngFor="let i of [0, 1, 2, 3, 4, 5]"
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="otp-box"
          [class.filled]="digits()[i]"
          (input)="onInput($event, i)"
          (keydown)="onKeyDown($event, i)"
          (paste)="onPaste($event)"
        />
      </div>
      <div class="field-help error" *ngIf="invalid">{{ errorText }}</div>
    </div>
  `,
  styles: [`
    .otp-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .otp-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary, #000);
    }

    .otp-boxes {
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    .otp-box {
      width: 50px;
      height: 50px;
      font-size: 24px;
      font-weight: 600;
      text-align: center;
      border: 2px solid var(--border-color, #d1d5db);
      border-radius: 8px;
      transition: all 0.3s ease;
      background-color: var(--bg-secondary, #fff);
      color: var(--text-primary, #000);
    }

    .otp-box:focus {
      outline: none;
      border-color: var(--primary, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .otp-box.filled {
      border-color: var(--primary, #3b82f6);
    }

    :host-context(.dark-theme) .otp-box {
      background-color: #1f2937;
      border-color: #4b5563;
      color: #fff;
    }

    :host-context(.dark-theme) .otp-box:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
    }

    :host-context(.dark-theme) .otp-label {
      color: #e5e7eb;
    }

    .field-help {
      font-size: 13px;
      margin-top: 4px;
    }

    .field-help.error {
      color: var(--error, #dc2626);
    }
  `],
})
export class OtpInputComponent {
  @Input({ required: true }) control!: FormControl<string>;
  @Input() label = 'OTP';
  @Input() errorText = 'Enter a valid 6-digit OTP.';
  @ViewChildren('otpInput') otpInputs!: QueryList<any>;

  digits = signal<string[]>(['', '', '', '', '', '']);

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Only allow digits
    value = value.replace(/[^0-9]/g, '');
    input.value = value;

    if (value) {
      const digitsArray = this.digits();
      digitsArray[index] = value;
      this.digits.set([...digitsArray]);

      // Auto move to next box
      if (index < 5) {
        setTimeout(() => {
          const inputs = this.otpInputs.toArray();
          inputs[index + 1].nativeElement.focus();
        }, 0);
      }
    } else {
      const digitsArray = this.digits();
      digitsArray[index] = '';
      this.digits.set([...digitsArray]);
    }

    // Update form control with combined OTP
    const otp = this.digits().join('');
    this.control.setValue(otp);
    if (otp.length === 6) {
      this.control.markAsTouched();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      event.preventDefault();
      const input = event.target as HTMLInputElement;
      const digitsArray = this.digits();

      if (input.value) {
        // Clear current box
        digitsArray[index] = '';
        this.digits.set([...digitsArray]);
        input.value = '';
      } else if (index > 0) {
        // Move to previous box and clear it
        digitsArray[index - 1] = '';
        this.digits.set([...digitsArray]);
        const inputs = this.otpInputs.toArray();
        inputs[index - 1].nativeElement.value = '';
        inputs[index - 1].nativeElement.focus();
      }

      this.control.setValue(this.digits().join(''));
    } else if (event.key === 'ArrowLeft' && index > 0) {
      const inputs = this.otpInputs.toArray();
      inputs[index - 1].nativeElement.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      const inputs = this.otpInputs.toArray();
      inputs[index + 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/[^0-9]/g, '').slice(0, 6).split('');

    this.digits.set([...digits, ...Array(6 - digits.length).fill('')]);
    this.control.setValue(digits.join(''));

    // Focus on next empty box or last box
    setTimeout(() => {
      const inputs = this.otpInputs.toArray();
      const nextEmpty = inputs.findIndex((inp, i) => !this.digits()[i]);
      if (nextEmpty !== -1) {
        inputs[nextEmpty].nativeElement.focus();
      } else {
        inputs[5].nativeElement.focus();
      }
    }, 0);
  }

  get invalid(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }
}
