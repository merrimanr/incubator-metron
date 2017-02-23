import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-alert-details',
  templateUrl: './alert-details.component.html',
  styleUrls: ['./alert-details.component.scss']
})
export class AlertDetailsComponent implements OnInit {

  constructor(private router: Router) { }

  goBack() {
    this.router.navigateByUrl('/alerts-list');
    return false;
  }

  ngOnInit() {
  }

}
