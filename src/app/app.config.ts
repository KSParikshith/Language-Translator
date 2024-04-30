import { ApplicationConfig, NgModule, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


NgModule({
  imports: [
    FormsModule,
    HttpClientModule,
  ]
  })

  
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    importProvidersFrom(HttpClientModule),
  ]
};

