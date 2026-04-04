# Customer Support Ticket Portal

Full-stack support ticket portal with Angular standalone frontend, Django REST backend, JWT authentication, email OTP login, OTP-based password reset, role-based access control, ticket management, and responsive UI patterns.

## Stack

- Frontend: Angular 19 standalone components + Angular Material
- Backend: Django 5 + Django REST Framework + Simple JWT
- Database: MySQL
- Email: SMTP or Django console backend for local development

## Backend Structure

```text
backend/
  accounts/
    migrations/
    admin.py
    models.py
    permissions.py
    serializers.py
    services.py
    urls.py
    views.py
  tickets/
    migrations/
    admin.py
    models.py
    permissions.py
    serializers.py
    views.py
  support_portal/
    settings.py
    urls.py
  templates/emails/otp_email.html
  requirements.txt
  manage.py
```

## Angular Structure

```text
frontend/
  src/
    app/
      core/
        guards/
        interceptors/
        models/
        services/
      features/
        auth/
        dashboard/
        tickets/
        profile/
      layout/
      app.component.ts
      app.routes.ts
    main.ts
    styles.css
  angular.json
  package.json
```

## Component Breakdown

- `LoginComponent`: email/password, OTP step, resend timer
- `RegisterComponent`: direct registration without OTP
- `ForgotPasswordComponent`: email -> OTP -> reset password flow
- `AdminDashboardComponent`: admin/agent ticket summary cards
- `TicketListComponent`: search, filters, pagination, table listing
- `CreateTicketComponent`: create ticket with attachment
- `TicketDetailComponent`: ticket metadata, status update, assignment, chat-style comments, internal notes
- `ProfileComponent`: current user profile
- `AppShellComponent`: responsive app layout/sidebar

## API Endpoints

### Authentication

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/verify-otp/`
- `POST /api/auth/resend-otp/`
- `POST /api/auth/forgot-password/`
- `POST /api/auth/reset-password/`
- `POST /api/auth/token/refresh/`
- `GET /api/auth/profile/`
- `GET /api/auth/staff-users/`

### Tickets

- `GET /api/tickets/`
- `POST /api/tickets/`
- `GET /api/tickets/{id}/`
- `PATCH /api/tickets/{id}/`
- `DELETE /api/tickets/{id}/`
- `POST /api/tickets/{id}/comments/`
- `GET /api/tickets/dashboard/`

### Ticket Query Features

- Search: `?search=laptop`
- Pagination: `?page=2`
- Status filter: `?status=open`
- Priority filter: `?priority=high`
- Date filter: `?date_from=2026-03-01&date_to=2026-03-31`

## Login With OTP Flow

1. User submits email and password to `POST /api/auth/login/`.
2. Backend authenticates credentials.
3. Backend creates an `OTPRequest` row with code, expiry, resend timestamp, and attempt counter.
4. Backend sends OTP by email.
5. Frontend switches to OTP screen and starts the 60-second resend timer.
6. User submits OTP to `POST /api/auth/verify-otp/` with `purpose=login`.
7. Backend verifies OTP, marks it verified, and returns JWT access/refresh tokens plus user data.
8. Frontend stores JWT and routes by role.

## Forgot Password Flow

1. User submits email to `POST /api/auth/forgot-password/`.
2. Backend validates the email exists and sends OTP.
3. Frontend displays OTP + new password step and starts resend timer.
4. User submits `email`, `otp_code`, and `new_password` to `POST /api/auth/reset-password/`.
5. Backend verifies OTP, hashes the new password, and saves it.
6. User returns to login and signs in with OTP flow.

## UI Design Direction

- Soft glass cards over a pale slate/teal gradient background
- Clean spacing, restrained color palette, rounded surfaces, and shadow depth
- Tables for ticket overview, cards for summaries, snackbars for feedback
- Mobile-first responsive grid behavior with stacked panels on smaller screens
- Chat-style comments on detail page to make discussion history easy to scan

## Frontend/Backend Connection

- Angular `AuthService` and `TicketService` call Django REST endpoints over HTTP.
- Angular auth interceptor injects `Bearer <JWT>` for protected API requests.
- Django Simple JWT handles token auth and RBAC is enforced in view permissions and query filtering.
- Customer users only see their own tickets/comments.
- Admin and support agents can see all tickets, update status, assign ownership, and create internal notes.

## Core Models

- `User`: email-first auth, role, full name, hashed password
- `OTPRequest`: email, purpose, otp code, expiry time, verified flag, resend timestamp, attempts
- `Ticket`: creator, assignee, title, description, priority, status, attachment
- `Comment`: ticket, author, message, internal note flag, timestamp

## Security Notes

- Passwords are hashed with Django's password hasher
- OTPs expire after 5 minutes
- Resend is blocked for 60 seconds
- OTP attempts are capped
- JWT protects authenticated APIs
- Role-based access is applied server-side, not only in UI

## Local Run

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Production Hardening Suggestions

- Move OTP storage to Redis for high-volume workloads
- Hash OTP codes at rest instead of storing raw codes
- Add DRF throttling classes for login, OTP verify, resend, and password reset endpoints
- Add refresh-token rotation and logout invalidation
- Add Celery for async email delivery
- Add WebSocket notifications for real-time ticket updates
