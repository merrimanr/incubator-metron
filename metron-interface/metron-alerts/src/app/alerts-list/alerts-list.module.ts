import {NgModule} from '@angular/core';

import {AlertsListComponent}   from './alerts-list.component';
import {routing} from './alerts-list.routing';
import {SharedModule} from '../shared/shared.module';
import {AlertService} from '../service/alert.service';

@NgModule({
    imports: [routing, SharedModule],
    exports: [],
    declarations: [AlertsListComponent],
    providers: [AlertService],
})
export class AlertsListModule {
}
