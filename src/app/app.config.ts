import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
};
