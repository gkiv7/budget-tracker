import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {routes} from './app/app.routes'
import {provideRouter, RouterModule} from '@angular/router'
import {provideHttpClient, withInterceptorsFromDi}from '@angular/common/http'


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi())
  ]
})
  .catch((err) => console.error(err));
