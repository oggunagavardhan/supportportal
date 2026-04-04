import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const roleGuard = (route) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const allowedRoles = route.data['roles'];
    const role = authService.user()?.role;
    if (role && allowedRoles.includes(role)) {
        return true;
    }
    return router.createUrlTree(['/tickets']);
};
//# sourceMappingURL=role.guard.js.map