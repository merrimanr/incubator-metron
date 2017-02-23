import { NgModule } from '@angular/core';
import {routing} from './alerts-details.routing';
import {SharedModule} from '../shared/shared.module';
import {AlertDetailsComponent} from './alert-details.component';

@NgModule ({
    imports: [ routing,  SharedModule],
    declarations: [ AlertDetailsComponent ]
})
export class AlertDetailsModule { }