import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';
import { ServiceWorkerModule } from '@angular/service-worker';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers
  ]
}).catch(err => console.error(err));
