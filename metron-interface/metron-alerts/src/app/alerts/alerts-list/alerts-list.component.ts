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
import {Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {Subscription} from 'rxjs/Rx';

import {Alert} from '../../model/alert';
import {SearchService} from '../../service/search.service';
import {UpdateService} from '../../service/update.service';
import {QueryBuilder} from './query-builder';
import {ConfigureTableService} from '../../service/configure-table.service';
import {AlertService} from '../../service/alert.service';
import {ColumnMetadata} from '../../model/column-metadata';
import {SavedSearchService} from '../../service/saved-search.service';
import {SavedSearch} from '../../model/saved-search';
import {TableMetadata} from '../../model/table-metadata';
import {MetronDialogBox, DialogType} from '../../shared/metron-dialog-box';
import {AlertSearchDirective} from '../../shared/directives/alert-search.directive';
import {SearchResponse} from '../../model/search-response';
import {ElasticsearchUtils} from '../../utils/elasticsearch-utils';
import {TableViewComponent} from './table-view/table-view.component';
import {Filter} from '../../model/filter';
import {Pagination} from '../../model/pagination';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-alerts-list',
  templateUrl: './alerts-list.component.html',
  styleUrls: ['./alerts-list.component.scss']
})

export class AlertsListComponent implements OnInit, OnDestroy {

  alertsColumnsToDisplay: ColumnMetadata[] = [];
  selectedAlerts: Alert[] = [];
  alerts: Alert[] = [];
  searchResponse: SearchResponse = new SearchResponse();
  colNumberTimerId: number;
  refreshTimer: Subscription;
  pauseRefresh = false;
  lastPauseRefreshValue = false;
  indices: string[];

  @ViewChild('table') table: ElementRef;
  @ViewChild('dataViewComponent') dataViewComponent: TableViewComponent;
  @ViewChild(AlertSearchDirective) alertSearchDirective: AlertSearchDirective;

  tableMetadata = new TableMetadata();
  queryBuilder: QueryBuilder = new QueryBuilder();
  pagination: Pagination = new Pagination();

  constructor(private router: Router,
              private searchService: SearchService,
              private updateService: UpdateService,
              private configureTableService: ConfigureTableService,
              private alertService: AlertService,
              private savedSearchService: SavedSearchService,
              private metronDialogBox: MetronDialogBox) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart && event.url === '/alerts-list') {
        this.selectedAlerts = [];
        this.restoreRefreshState();
      }
    });
    if (environment.indices) {
      this.indices = environment.indices.split(',');
    }
  }

  addTableMetadataChangedListener() {
    this.configureTableService.tableMetadataChanged$.subscribe(tableMetadata => {
      this.prepareData(tableMetadata, false);
    });
  }

  addLoadSavedSearchListener() {
    this.savedSearchService.loadSavedSearch$.subscribe((savedSearch: SavedSearch) => {
      this.queryBuilder = new QueryBuilder();
      this.queryBuilder.searchRequest = savedSearch.searchRequest;
      this.prepareColumnData(savedSearch.tableColumns);
      this.search(true, savedSearch);
    });
  }

  calcColumnsToDisplay() {
    let availableWidth = document.documentElement.clientWidth - (200 + (15 * 3)); /* screenwidth - (navPaneWidth + (paddings))*/
    availableWidth = availableWidth - (55 + 25 + 25); /* availableWidth - (score + colunSelectIcon +selectCheckbox )*/
    let tWidth = 0;
    this.alertsColumnsToDisplay =  this.queryBuilder.tableColumns.filter(colMetaData => {
      if (colMetaData.type.toUpperCase() === 'DATE') {
        tWidth += 140;
      } else if (colMetaData.type.toUpperCase() === 'IP') {
        tWidth += 120;
      } else if (colMetaData.type.toUpperCase() === 'BOOLEAN') {
        tWidth += 50;
      } else {
        tWidth += 130;
      }

      return tWidth < availableWidth;
    });
  }

  getAlertColumnNames(resetPaginationForSearch: boolean) {
    this.configureTableService.getTableMetadata().subscribe(tableMetadata => {
      this.prepareData(tableMetadata, resetPaginationForSearch);
    });
  }

  ngOnDestroy() {
    this.tryStopPolling();
  }

  ngOnInit() {
    this.getAlertColumnNames(true);
    this.addTableMetadataChangedListener();
    this.addLoadSavedSearchListener();
  }

  onClear() {
    this.queryBuilder.displayQuery = '';
    this.search();
  }

  onSearch($event) {
    this.queryBuilder.displayQuery = $event;
    this.search();

    return false;
  }

  onRefreshData($event) {
    this.search($event);
  }

  onSelectedAlertsChange(selectedAlerts) {
    if (selectedAlerts.length > 0) {
      this.pause();
    } else {
      this.resume();
    }
  }

  onAddFilter(filter: Filter) {
    this.queryBuilder.addOrUpdateFilter(filter);
    this.search();
  }

  onPageSizeChanged(pageSize: number) {
    this.configureTableService.savePageSize(pageSize).subscribe(tableMetadata => {
      this.tableMetadata.pageSize = tableMetadata.pageSize;
    });
    this.search();
  }

  onRefreshIntervalChanged(interval: number) {
    this.configureTableService.saveRefreshInterval(interval).subscribe(tableMetadata => {
      this.tableMetadata.refreshInterval = tableMetadata.refreshInterval;
    });
    this.searchService.interval = interval;
    this.search();
  }

  onPausePlay() {
    this.pauseRefresh = !this.pauseRefresh;
    if (this.pauseRefresh) {
      this.tryStopPolling();
    } else {
      this.search(false);
    }
  }

  onResize() {
    clearTimeout(this.colNumberTimerId);
    this.colNumberTimerId = setTimeout(() => { this.calcColumnsToDisplay(); }, 500);
  }

  prepareColumnData(configuredColumns: ColumnMetadata[]) {
    this.queryBuilder.tableColumns = configuredColumns;
    this.calcColumnsToDisplay();
  }

  prepareData(tableMetaData: TableMetadata, resetPagination: boolean) {
    this.tableMetadata = tableMetaData;
    this.updateConfigRowsSettings();
    this.prepareColumnData(tableMetaData.tableColumns);

    this.search(resetPagination);
  }

  processEscalate() {
    this.updateService.updateAlertState(this.selectedAlerts, 'ESCALATE').subscribe(results => {
      this.updateSelectedAlertStatus('ESCALATE');
    });
    this.alertService.escalate(this.selectedAlerts).subscribe();
   
  }

  processDismiss() {
    this.updateService.updateAlertState(this.selectedAlerts, 'DISMISS').subscribe(results => {
      this.updateSelectedAlertStatus('DISMISS');
    });
  }

  processOpen() {
    this.updateService.updateAlertState(this.selectedAlerts, 'OPEN').subscribe(results => {
      this.updateSelectedAlertStatus('OPEN');
    });
  }

  processResolve() {
    this.updateService.updateAlertState(this.selectedAlerts, 'RESOLVE').subscribe(results => {
      this.updateSelectedAlertStatus('RESOLVE');
    });
  }

  removeFilter(field: string) {
    this.queryBuilder.removeFilter(field);
    this.search();
  }

  restoreRefreshState() {
    this.pauseRefresh = this.lastPauseRefreshValue;
    this.tryStartPolling();
  }

  search(resetPaginationParams = true, savedSearch?: SavedSearch) {
    this.saveCurrentSearch(savedSearch);
    if (resetPaginationParams) {
      this.pagination.from = 0;
    }
    this.queryBuilder.searchRequest.from = this.pagination.from;
    if (this.tableMetadata.pageSize) {
      this.pagination.size = this.tableMetadata.pageSize;
    }
    this.queryBuilder.searchRequest.size = this.pagination.size;
    if (this.indices) {
      this.queryBuilder.searchRequest.indices = this.indices;
    }
    this.searchService.search(this.queryBuilder.searchRequest).subscribe(results => {
      this.setData(results);
    }, error => {
      this.setData(new SearchResponse());
      this.metronDialogBox.showConfirmationMessage(ElasticsearchUtils.extractESErrorMessage(error), DialogType.Error);
    });

    this.tryStartPolling();
  }

  saveCurrentSearch(savedSearch: SavedSearch) {
    if (this.queryBuilder.query !== '*') {
      if (!savedSearch) {
        savedSearch = new SavedSearch();
        savedSearch.searchRequest = this.queryBuilder.searchRequest;
        savedSearch.tableColumns = this.queryBuilder.tableColumns;
        savedSearch.name = savedSearch.getDisplayString();
      }

      this.savedSearchService.saveRecentSearch(savedSearch).subscribe(() => {
      });
    }
  }

  setData(results: SearchResponse) {
    this.selectedAlerts = [];
    this.searchResponse = results;
    this.pagination.total = results.total;
    this.alerts = results.results ? results.results : [];
  }

  showConfigureTable() {
    this.saveRefreshState();
    this.router.navigateByUrl('/alerts-list(dialog:configure-table)');
  }

  showDetails(alert: Alert) {
    this.selectedAlerts = [];
    this.selectedAlerts = [alert];
    this.saveRefreshState();
    this.router.navigateByUrl('/alerts-list(dialog:details/' + alert.source['source:type'] + '/' + alert.id + ')');
  }

  saveRefreshState() {
    this.lastPauseRefreshValue = this.pauseRefresh;
    this.tryStopPolling();
  }

  pause() {
    this.pauseRefresh = true;
    this.tryStopPolling();
  }

  resume() {
    this.pauseRefresh = false;
    this.tryStartPolling();
  }

  showSavedSearches() {
    this.saveRefreshState();
    this.router.navigateByUrl('/alerts-list(dialog:saved-searches)');
  }

  showSaveSearch() {
    this.saveRefreshState();
    this.savedSearchService.setCurrentQueryBuilder(this.queryBuilder);
    this.router.navigateByUrl('/alerts-list(dialog:save-search)');
  }

  tryStartPolling() {
    if (!this.pauseRefresh) {
      this.tryStopPolling();
      this.refreshTimer = this.searchService.pollSearch(this.queryBuilder.searchRequest).subscribe(results => {
        this.setData(results);
      });
    }
  }

  tryStopPolling() {
    if (this.refreshTimer && !this.refreshTimer.closed) {
      this.refreshTimer.unsubscribe();
    }
  }

  updateConfigRowsSettings() {
    this.searchService.interval = this.tableMetadata.refreshInterval;
  }

  updateSelectedAlertStatus(status: string) {
    for (let selectedAlert of this.selectedAlerts) {
      selectedAlert.status = status;
      this.alerts.filter(alert => alert.id == selectedAlert.id)
      .map(alert => alert.source['alert_status'] = status);
    }
    this.selectedAlerts = [];
    this.resume();
  }

}
