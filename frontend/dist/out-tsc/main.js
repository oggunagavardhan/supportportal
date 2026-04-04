import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
bootstrapApplication(AppComponent, {
    providers: [
        provideAnimations(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideRouter(appRoutes),
        importProvidersFrom(MatSnackBarModule),
    ],
}).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map