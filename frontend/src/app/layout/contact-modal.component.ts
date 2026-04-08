import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../core/services/notification.service';
import { I18nPipe } from '../core/pipes/i18n.pipe';

@Component({
  standalone: true,
  selector: 'app-contact-modal',
  imports: [CommonModule, I18nPipe],
  template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="closeModal()" [class.visible]="isVisible">
      <div class="modal-content" (click)="$event.stopPropagation()" [class.visible]="isVisible">
        <div class="modal-header">
          <h2>{{ 'contact.title' | t }}</h2>
          <button class="close-btn" (click)="closeModal()" [attr.aria-label]="'common.close' | t">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="subtitle">{{ 'contact.subtitle' | t }}</p>
          <div class="contact-options">
            <!-- Email Option -->
            <a
              class="contact-card email-card"
              href="https://mail.google.com/mail/?view=cm&fs=1&to=support@supportportal.com"
              target="_blank"
              rel="noopener noreferrer"
              (click)="closeModal()"
            >
              <div class="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              </div>
              <div class="card-text">
                <h3>{{ 'contact.email_title' | t }}</h3>
                <p>{{ 'contact.response_hour' | t }}</p>
              </div>
            </a>

            <!-- Phone Option -->
            <button type="button" class="contact-card phone-card" (click)="openCallSupport()">
              <div class="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div class="card-text">
                <h3>{{ 'contact.phone_title' | t }}</h3>
                <p>{{ 'contact.phone_hours' | t }}</p>
              </div>
            </button>

            <!-- Chat Option -->
            <button type="button" class="contact-card chat-card" (click)="openLiveChat()">
              <div class="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div class="card-text">
                <h3>{{ 'contact.chat_title' | t }}</h3>
                <p>{{ 'contact.response_hour' | t }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    .modal-backdrop.visible {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-content {
      background: #ffffff;
      width: 90%;
      max-width: 440px;
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      transform: translateY(20px) scale(0.95);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .modal-content.visible {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .modal-header h2 {
      margin: 0;
      font-size: 24px;
      color: #1e293b;
      font-weight: 800;
    }
    .close-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      color: #64748b;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, color 0.2s;
    }
    .close-btn:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .subtitle {
      color: #64748b;
      margin: 0 0 20px 0;
      font-size: 15px;
    }
    .contact-options {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .contact-card {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
      padding: 16px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      background: #fafafa;
      text-decoration: none;
      color: inherit;
      text-align: left;
      font: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .contact-card:hover {
      background: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.06);
      border-color: #cbd5e1;
    }
    .icon-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-circle svg {
      color: #ffffff;
      width: 20px;
      height: 20px;
    }
    .email-card .icon-circle { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .phone-card .icon-circle { background: linear-gradient(135deg, #10b981, #059669); }
    .chat-card .icon-circle { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    
    .card-text h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      color: #0f172a;
      font-weight: 700;
    }
    .card-text p {
      margin: 0;
      font-size: 13px;
      color: #64748b;
    }

    /* Dark theme support */
    :host-context(.dark-theme) .modal-content {
      background: #1e293b;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    :host-context(.dark-theme) .modal-header h2 { color: #f8fafc; }
    :host-context(.dark-theme) .close-btn { color: #94a3b8; }
    :host-context(.dark-theme) .close-btn:hover { background: #334155; color: #f8fafc; }
    :host-context(.dark-theme) .subtitle { color: #94a3b8; }
    :host-context(.dark-theme) .contact-card {
      background: #0f172a;
      border-color: #334155;
    }
    :host-context(.dark-theme) .contact-card:hover {
      background: #1e293b;
      border-color: #475569;
    }
    :host-context(.dark-theme) .card-text h3 { color: #f1f5f9; }
    :host-context(.dark-theme) .card-text p { color: #94a3b8; }
  `]
})
export class ContactModalComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();
  isVisible = false;
  private readonly tawkScriptId = 'tawk-support-widget';
  private notify = inject(NotificationService);
  private router = inject(Router);

  ngOnChanges() {
    if (this.isOpen) {
      setTimeout(() => this.isVisible = true, 10);
    } else {
      this.isVisible = false;
    }
  }

  closeModal() {
    this.isVisible = false;
    setTimeout(() => {
      this.closeEvent.emit();
    }, 300);
  }

  openLiveChat() {
    this.closeModal();
    const w = window as any;
    if (w.Tawk_API?.toggle) {
      w.Tawk_API.toggle();
      return;
    }

    this.notify.success('Opening Chat Support...');
    const existingScript = document.getElementById(this.tawkScriptId) as HTMLScriptElement | null;
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = this.tawkScriptId;
      script.async = true;
      script.src = 'https://embed.tawk.to/658b090170c9f2407f83b123/1hii04f6l';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      document.body.appendChild(script);
    }

    w.Tawk_API = w.Tawk_API || {};
    w.Tawk_API.onLoad = () => {
      if (w.Tawk_API?.toggle) {
        w.Tawk_API.toggle();
      }
    };

    setTimeout(() => {
      if (!w.Tawk_API?.toggle) {
        this.notify.success('Opening in-app Chat Support...');
        this.router.navigate(['/messages']);
      }
    }, 2000);
  }

  openCallSupport() {
    this.closeModal();
    const phone = '+18001234567';
    const link = document.createElement('a');
    link.href = `tel:${phone}`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.notify.success('Calling +1 (800) 123-4567. If not opened, dial manually.');
  }

}
