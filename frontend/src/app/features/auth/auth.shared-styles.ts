export const AUTH_PAGE_STYLES = `
  .auth-shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 20px;
    background:
      radial-gradient(circle at top right, rgba(255, 255, 255, 0.75), transparent 28%),
      linear-gradient(180deg, var(--auth-bg) 0%, color-mix(in srgb, var(--auth-bg) 78%, white) 100%);
  }

  .auth-layout {
    width: min(100%, 450px);
    display: block;
    margin: 0 auto;
    position: relative;
    z-index: 10;
  }

  .auth-card {
    border-radius: 22px;
    background: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.72);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 440px;
    margin: 0 auto;
    text-align: center;
  }

  .auth-card h2 {
    margin: 14px 0 16px;
    color: var(--auth-text);
    line-height: 1.15;
    text-align: center;
    font-size: 24px;
    font-weight: 800;
  }

  .auth-card p,
  .field-help,
  .aux-text {
    color: var(--auth-muted);
    line-height: 1.55;
  }

  .auth-card {
    padding: 32px;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--auth-accent) 10%, white);
    color: var(--auth-text);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0 auto 12px;
  }

  .auth-form {
    display: grid;
    gap: 8px;
    margin-top: 18px;
    width: 100%;
  }

  .auth-form.two-actions {
    gap: 12px;
  }

  .action-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .action-row > * {
    flex: 1 1 180px;
  }

  .links {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .links a,
  .inline-link {
    color: var(--auth-accent);
    text-decoration: none;
    font-weight: 700;
    flex: 1;
    text-align: center;
  }

  .links a:hover,
  .inline-link:hover {
    color: var(--auth-accent-hover);
  }

  .field-feedback-container {
    height: 18px; /* FIXED SPACE - NO OVERLAP */
    margin-top: 4px; /* MOVED DOWN SLIGHTLY */
    margin-bottom: 4px;
    overflow: hidden;
  }
  .field-help {
    font-size: 12px;
    display: block;
    line-height: 18px;
    text-align: center;
  }

  .field-help.error {
    color: #dc2626;
    font-weight: 700;
  }

  .success-text {
    color: #16a34a;
    font-size: 14px;
    font-weight: 700;
    margin-top: 10px;
  }

  .otp-note {
    padding: 14px 16px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--auth-accent) 8%, white);
    color: var(--auth-text);
    font-size: 14px;
  }

  .password-rules {
    display: grid;
    gap: 6px;
    margin-top: -2px;
    padding: 12px 14px;
    border-radius: 12px;
    background: #fafafa;
    border: 1px solid color-mix(in srgb, var(--auth-accent) 12%, white);
  }

  .password-rules span {
    font-size: 12px;
    color: var(--auth-muted);
  }

  .password-rules span.invalid {
    color: #dc2626;
  }

  .password-rules span.valid {
    color: #16a34a;
  }

  .theme-field {
    --mdc-outlined-text-field-outline-color: rgba(0, 0, 0, 0.12);
    --mdc-outlined-text-field-focus-outline-color: var(--auth-accent);
    --mdc-outlined-text-field-hover-outline-color: var(--auth-accent);
    --mdc-outlined-text-field-label-text-color: var(--auth-muted);
    --mdc-outlined-text-field-focus-label-text-color: var(--auth-accent);
    --mat-form-field-focus-select-arrow-color: var(--auth-accent);
    --mdc-text-field-container-height: 44px; /* COMPACT HEIGHT */
    --mdc-outlined-text-field-outline-width: 1.2px;
    --mdc-outlined-text-field-focus-outline-width: 1.2px;
    --mdc-outlined-text-field-container-shape: 12px;
  }

  .theme-field.invalid-field {
    --mdc-outlined-text-field-outline-color: #dc2626;
    --mdc-outlined-text-field-hover-outline-color: #dc2626;
    --mdc-outlined-text-field-focus-outline-color: #dc2626;
    --mdc-outlined-text-field-label-text-color: #dc2626;
    --mdc-outlined-text-field-focus-label-text-color: #dc2626;
  }

  .theme-primary-btn {
    --mdc-filled-button-container-color: var(--auth-accent);
    --mdc-filled-button-label-text-color: #ffffff;
    min-height: 48px;
    border-radius: 12px;
  }

  .theme-secondary-btn {
    min-height: 48px;
    border-radius: 10px;
    color: var(--auth-accent);
    border-color: color-mix(in srgb, var(--auth-accent) 34%, white);
  }

  .theme-primary-btn:hover {
    --mdc-filled-button-container-color: var(--auth-accent-hover);
  }

  @media (max-width: 560px) {
    .auth-shell {
      padding: 14px;
    }

    .auth-card {
      padding: 22px;
    }

    .links {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;
