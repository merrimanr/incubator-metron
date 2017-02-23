import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {Alert} from '../model/alert';
import {AlertService} from '../service/alert.service';
import {SearchRequest} from "../model/search-request";

@Component({
  selector: 'app-alerts-list',
  templateUrl: './alerts-list.component.html',
  styleUrls: ['./alerts-list.component.scss']
})
export class AlertsListComponent implements OnInit {

  alerts: Alert[] = [];
  alertsColumnNames = [
    'Score',
    'Description',
    'Alert ID',
    'Age',
    'Alert Source',
    'Source IP',
    'Source Location',
    'Destination IP',
    'Designated Host',
    'Status'
  ];

  searchRequest: SearchRequest = { query: { query_string: { query: '*'} }, from: 0, size: 10, sort: [{ timestamp: {order : 'desc', ignore_unmapped: true} }], aggs: {}};

  constructor(private router: Router, private alertsService: AlertService) { }

  ngOnInit() {
    this.search();
  }

  showDetails(alert: Alert) {
    this.router.navigateByUrl('/alerts-list(dialog:details/' + alert.alertId + ')');
  }

  search() {
    this.alertsService.search(this.searchRequest).subscribe(results => {
      //console.log(results);
      let alertResults = [];
      for(let hit of results['hits'].hits) {
        alertResults.push(new Alert(85,  'description', hit['_id'], hit['_source']['timestamp'], hit['_source']['source:type'], hit['_source']['ip_src_addr'], 'Los Angeles, CA USA', hit['_source']['ip_dst_addr'], 'x230-12811', 'New'));
      }
      this.alerts = alertResults;
    });
  }

}
