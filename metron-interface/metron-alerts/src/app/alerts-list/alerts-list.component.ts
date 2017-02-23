import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {Alert} from '../model/alert';
import {AlertService} from '../service/alert.service';

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
  constructor(private router: Router, private alertsService: AlertService) { }

  ngOnInit() {
    this.alertsService.getAll().subscribe(alerts => {
      this.alerts = alerts;
    })
  }

  showDetails(alert: Alert) {
    this.router.navigateByUrl('/alerts-list(dialog:details/' + alert.alertId + ')');
  }

}
