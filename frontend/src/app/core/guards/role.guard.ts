import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as string[];
  const user = authService.user();
  if (user?.is_superuser) {
    return true;
  }
  const role = user?.role;

  if (role && allowedRoles.includes(role)) {
    return true;
  }
  return router.createUrlTree(['/tickets']);
};
