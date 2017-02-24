import { Component, OnInit } from '@angular/core';
import {Router, NavigationStart} from '@angular/router';

import {Alert} from '../model/alert';
import {AlertService} from '../service/alert.service';
import {SearchRequest} from "../model/search-request";

@Component({
  selector: 'app-alerts-list',
  templateUrl: './alerts-list.component.html',
  styleUrls: ['./alerts-list.component.scss']
})
export class AlertsListComponent implements OnInit {

  selectedIds: string[] = [];
  alerts: Alert[] = [];
  alertsColumnNames = [
    { 'key': 'score',           'display': 'Score',             'type': 'number'},
    { 'key': 'description',     'display': 'Description',       'type': 'string'},
    { 'key': 'alertId',         'display': 'Alert ID',          'type': 'string'},
    { 'key': 'age',             'display': 'Age',               'type': 'string'},
    { 'key': 'alertSource',     'display': 'Alert Source',      'type': 'string'},
    { 'key': 'sourceIp',        'display': 'Source IP',         'type': 'string'},
    { 'key': 'sourceLocation',  'display': 'Source Location',   'type': 'string'},
    { 'key': 'destinationIP',   'display': 'Destination IP',    'type': 'string'},
    { 'key': 'designatedHost',  'display': 'Designated Host',   'type': 'string'},
    { 'key': 'status',          'display': 'Status',            'type': 'string'}
  ];

  searchRequest: SearchRequest = { query: { query_string: { query: '*'} }, from: 0, size: 10, sort: [{ timestamp: {order : 'desc', ignore_unmapped: true} }], aggs: {}};

  constructor(private router: Router, private alertsService: AlertService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart && event.url === '/alerts-list') {
        this.selectedIds = [];
      }
    });
  }

  ngOnInit() {
    this.search();
  }

  onKeyUp($event) {
    if ($event.keyCode === 13) {
      this.search();
    }
  }

  selectAllRows($event) {
    this.selectedIds = [];
    if ($event.target.checked) {
      this.selectedIds = this.alerts.map(alert => alert.alertId);
    }
  }

  search() {
    this.alertsService.getAll().subscribe(alerts => this.alerts = alerts);
    // this.alertsService.search(this.searchRequest).subscribe(results => {
    //   //console.log(results);
    //   let alertResults = [];
    //   for(let hit of results['hits'].hits) {
    //     alertResults.push(new Alert(85,  'description', hit['_id'], hit['_source']['timestamp'], hit['_source']['source:type'], hit['_source']['ip_src_addr'], 'Los Angeles, CA USA', hit['_source']['ip_dst_addr'], 'x230-12811', 'New'));
    //   }
    //   this.alerts = alertResults;
    // });
  }

  selectRow($event, alert: Alert) {
    if ($event.target.checked) {
      this.selectedIds.push(alert.alertId);
    } else {
      this.selectedIds.splice(this.selectedIds.indexOf(alert.alertId), 1);
    }
  }
  
  showDetails($event, alert: Alert) {
    if ($event.target.type !== 'checkbox' && $event.target.parentElement.firstChild.type !== 'checkbox') {
      this.selectedIds = [];
      this.selectedIds = [alert.alertId];
      this.router.navigateByUrl('/alerts-list(dialog:details/' + alert.alertId + ')');
    }
  }

  processOpen() {
    
  }

  processDismiss() {

  }

  processEscalate() {

  }

  processResolve() {

  }
}
