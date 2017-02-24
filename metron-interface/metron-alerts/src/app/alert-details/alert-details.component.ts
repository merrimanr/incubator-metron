import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertService} from '../service/alert.service';
import {Alert} from '../model/alert';

@Component({
  selector: 'app-alert-details',
  templateUrl: './alert-details.component.html',
  styleUrls: ['./alert-details.component.scss']
})
export class AlertDetailsComponent implements OnInit {

  selectedAlertId: string = '';
  alert: Alert = new Alert(-1, '', '', '', '', '', '', '', '', '');

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private alertsService: AlertService) { }

  goBack() {
    this.router.navigateByUrl('/alerts-list');
    return false;
  }

  getData() {
    this.alertsService.getAlert(this.selectedAlertId).subscribe(alert => {
      this.alert = alert
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.selectedAlertId = params['id'];
      this.getData();
    });
  }

  processEscalate() {

  }

  processNew() {

  }

  processOpen() {

  }

  processDismiss() {

  }

  processResolve() {
    
  }

}
