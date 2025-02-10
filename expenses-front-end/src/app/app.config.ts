
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';  // Εισαγωγή των routes

export const appConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(routes)  // Χρήση των routes
  ]
};