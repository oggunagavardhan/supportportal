import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 6000,
      panelClass: ['app-snackbar', 'app-snackbar-success'],
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 8000,
      panelClass: ['app-snackbar', 'app-snackbar-error'],
    });
  }
}
