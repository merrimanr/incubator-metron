/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {MetronAlertsRoutingModule} from './app-routing.module';
import {AlertsListModule} from './alerts/alerts-list/alerts-list.module';
import {AlertDetailsModule} from './alerts/alert-details/alerts-details.module';
import {ConfigureTableModule} from './alerts/configure-table/configure-table.module';
import {ConfigureTableService} from './service/configure-table.service';
import {SaveSearchModule} from './alerts/save-search/save-search.module';
import {SavedSearchService} from './service/saved-search.service';
import {SavedSearchesModule} from './alerts/saved-searches/saved-searches.module';
import {MetronDialogBox} from './shared/metron-dialog-box';
import {ConfigureRowsModule} from './alerts/configure-rows/configure-rows.module';
import {SwitchModule} from './shared/switch/switch.module';
import {LoginModule} from './login/login.module';
import {AuthGuard} from './shared/auth-guard';
import {AuthenticationService} from './service/authentication.service';
import {LoginGuard} from './shared/login-guard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MetronAlertsRoutingModule,
    LoginModule,
    AlertsListModule,
    AlertDetailsModule,
    ConfigureTableModule,
    ConfigureRowsModule,
    SaveSearchModule,
    SavedSearchesModule,
    SwitchModule
  ],
  providers: [AuthenticationService,
              AuthGuard,
              LoginGuard,
              ConfigureTableService,
              SavedSearchService,
              MetronDialogBox],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(router: Router) {
  }
}
