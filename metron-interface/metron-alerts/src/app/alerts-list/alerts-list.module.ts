import {NgModule} from '@angular/core';

import {AlertsListComponent}   from './alerts-list.component';
import {routing} from './alerts-list.routing';
import {SharedModule} from '../shared/shared.module';
import {AlertService} from '../service/alert.service';
import {MetronSorterModule} from '../shared/metron-table/metron-sorter/metron-sorter.module';

@NgModule({
    imports: [routing, SharedModule, MetronSorterModule],
    exports: [],
    declarations: [AlertsListComponent],
    providers: [AlertService],
})
export class AlertsListModule {
}
