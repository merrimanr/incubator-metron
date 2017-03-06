import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ConfigureTableService} from "../service/configure-table.service";
export enum AlertState {
  NEW, OPEN, ESCALATE, DISMISS, RESOLVE
}

@Component({
  selector: 'app-configure-table',
  templateUrl: './configure-table.component.html',
  styleUrls: ['./configure-table.component.scss']
})
export class ConfigureTableComponent {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private configureTableService: ConfigureTableService) { }

  goBack() {
    this.router.navigateByUrl('/alerts-list');
    return false;
  }

  onTableChanged() {
    this.configureTableService.onTableChanged();
  }

}


