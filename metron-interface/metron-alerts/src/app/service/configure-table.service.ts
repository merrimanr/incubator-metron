import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Alert} from '../model/alert';
import {Http, Headers, RequestOptions} from '@angular/http';
import {HttpUtil} from "../utils/httpUtil";
import {IAppConfig} from '../app.config.interface';
import {APP_CONFIG} from '../app.config';
import {Subject} from "rxjs/Subject";

@Injectable()
export class ConfigureTableService {

  defaultHeaders = {'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'};

  constructor(private http: Http, @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  private tableChangedSource = new Subject<string>();

  tableChanged$ = this.tableChangedSource.asObservable();

  onTableChanged() {
    this.tableChangedSource.next('table changed');
  }


}
