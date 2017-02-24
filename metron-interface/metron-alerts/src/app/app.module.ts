import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {MetronAlertsRoutingModule} from './app-routing.module';
import {AlertsListModule} from './alerts-list/alerts-list.module';
import { AlertDetailsComponent } from './alert-details/alert-details.component';
import {AlertDetailsModule} from './alert-details/alerts-details.module';
import {APP_CONFIG, METRON_REST_CONFIG} from "./app.config";
import {AlertSeverityDirective} from './shared/alert-severity.directive';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MetronAlertsRoutingModule,
    AlertsListModule,
    AlertDetailsModule
  ],
  providers: [{ provide: APP_CONFIG, useValue: METRON_REST_CONFIG }],
  bootstrap: [AppComponent]
})
export class AppModule { }
