import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
export const authInterceptor = (req, next) => {
    const auth = inject(AuthService);
    const token = localStorage.getItem('access_token');
    if (!token) {
        return next(req).pipe(catchError((error) => throwError(() => error)));
    }
    return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })).pipe(catchError((error) => {
        if (error.status === 401 && !req.url.includes('/api/auth/')) {
            auth.logout();
        }
        return throwError(() => error);
    }));
};
//# sourceMappingURL=auth.interceptor.js.map