import { Component, OnInit } from '@angular/core';
import {Router, NavigationStart} from '@angular/router';

import {Alert} from '../model/alert';
import {AlertService} from '../service/alert.service';
import {SearchRequest} from "../model/search-request";
import {Filter} from "../model/filter";

@Component({
  selector: 'app-alerts-list',
  templateUrl: './alerts-list.component.html',
  styleUrls: ['./alerts-list.component.scss']
})
export class AlertsListComponent implements OnInit {

  selectedAlerts: Alert[] = [];
  alerts: Alert[] = [];
  alertsColumnNames = [
    { 'key': 'score',           'display': 'Score',             'type': 'number'},
    { 'key': '_id',         'display': 'Alert ID',          'type': 'string'},
    { 'key': 'timestamp',             'display': 'Age',               'type': 'number'},
    { 'key': 'source_type',     'display': 'Alert Source',      'type': 'string'},
    { 'key': 'ip_src_addr',        'display': 'Source IP',         'type': 'string'},
    { 'key': 'sourceLocation',  'display': 'Source Location',   'type': 'string'},
    { 'key': 'ip_dst_addr',   'display': 'Destination IP',    'type': 'string'},
    { 'key': 'designatedHost',  'display': 'Designated Host',   'type': 'string'},
    { 'key': 'alert_status',          'display': 'Status',            'type': 'string'}
  ];

  searchRequest: SearchRequest = { query: { query_string: { query: '*'} }, from: 0, size: 10, sort: [{ timestamp: {order : 'desc', ignore_unmapped: true} }], aggs: {}};
  filters: Filter[] = [];

  constructor(private router: Router, private alertsService: AlertService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart && event.url === '/alerts-list') {
        this.selectedAlerts = [];
      }
    });
  }

  ngOnInit() {
    this.search();
  }

  onKeyUp($event) {
    if ($event.keyCode === 13) {
      this.onSearch();
    }
  }

  onSearch() {
    this.updateFilters();
    this.search();
  }

  onAddFilter(field: string, value: string) {
    this.addFilter(field, value);
    this.generateQuery();
    this.search();
  }

  selectAllRows($event) {
    this.selectedAlerts = [];
    if ($event.target.checked) {
      this.selectedAlerts = this.alerts;
    }
  }

  mockSearch() {
    this.selectedAlerts = [];
    this.alertsService.mockSearch().subscribe(results => {
      this.alerts = results;
    });
  }

  search() {
    this.selectedAlerts = [];
    this.alertsService.search(this.searchRequest).subscribe(results => {
      let alertResults = [];
      for(let hit of results['hits'].hits) {
        alertResults.push(new Alert(85,  'description', hit['_id'], hit['_source']['timestamp'], hit['_source']['source:type'],
          hit['_source']['ip_src_addr'], 'Los Angeles, CA USA', hit['_source']['ip_dst_addr'], 'x230-12811', hit['_source']['alert_status'], hit['_index'], hit['_type'], hit['_source']));
      }
      this.alerts = alertResults;
    });
  }

  selectRow($event, alert: Alert) {
    if ($event.target.checked) {
      this.selectedAlerts.push(alert);
    } else {
      this.selectedAlerts.splice(this.selectedAlerts.indexOf(alert), 1);
    }
  }

  showDetails($event, alert: Alert) {
    if ($event.target.type !== 'checkbox' && $event.target.parentElement.firstChild.type !== 'checkbox' && $event.target.nodeName !== 'A') {
      this.selectedAlerts = [];
      this.selectedAlerts = [alert];
      this.router.navigateByUrl('/alerts-list(dialog:details/' + alert._index + '/' + alert._type + '/' + alert.alertId + ')');
    }
  }

  processOpen() {
    this.alertsService.updateAlertState(this.selectedAlerts, 'OPEN', '').subscribe(results => {
      this.updateSelectedAlertStatus('OPEN');
      console.log(results);
    });
  }
  
  processDismiss() {
    this.alertsService.updateAlertState(this.selectedAlerts, 'DISMISS', '').subscribe(results => {
      this.updateSelectedAlertStatus('DISMISS');
      console.log(results);
    });
  }
  
  processEscalate() {
    this.alertsService.updateAlertState(this.selectedAlerts, 'ESCALATE', '').subscribe(results => {
      this.updateSelectedAlertStatus('ESCALATE');
      console.log(results);
    });
  }
  
  processResolve() {
    this.alertsService.updateAlertState(this.selectedAlerts, 'RESOLVE', '').subscribe(results => {
      this.updateSelectedAlertStatus('RESOLVE');
      console.log(results);
    });
  }

  updateSelectedAlertStatus(status: string) {
    for (let alert of this.selectedAlerts) {
      alert.status = status;
    }
  }

  addFilter(field: string, value: string) {
    let filter = this.filters.find(filter => filter.field === field);
    if (filter) {
      filter.value = value;
    } else {
      this.filters.push(new Filter(field, value));
    }
  }

  removeFilter(field: string) {
    let filter = this.filters.find(filter => filter.field === field);
    this.filters.splice(this.filters.indexOf(filter), 1);
    this.generateQuery();
    this.search();
  }

  generateQuery() {
    if (this.filters.length === 0) {
      this.searchRequest.query['query_string'].query = '*';
    } else {
      this.searchRequest.query['query_string'].query = this.filters.map(filter => filter.field + ':' + filter.value).join(' AND ');
    }
  }

  updateFilters() {
    let query = this.searchRequest.query['query_string'].query;
    this.filters = [];
    if (query && query !== '' && query !== '*') {
      let terms = query.split(' AND ');
      for (let term of terms) {
        let fieldValue = term.split(':');
        this.addFilter(fieldValue[0], fieldValue[1]);
      }
    }
  }

  highlightRow($event) {
    if ($event.target.nodeName !== 'A') {
      $event.target.parentElement.classList.add('highlighted');
    }
  }

  clearHighlight($event) {
    $event.target.parentElement.classList.remove('highlighted');
  }
}
