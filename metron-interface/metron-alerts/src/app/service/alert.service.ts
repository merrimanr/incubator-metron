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
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Alert} from '../model/alert';
import {Http, Headers, RequestOptions} from '@angular/http';
import {HttpUtil} from '../utils/httpUtil';
import {ColumnMetadata} from '../model/column-metadata';

@Injectable()
export class AlertService {

  defaultHeaders = {'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'};

  private defaultColumnMetadata = [
    new ColumnMetadata('id', '', 'string'),
    new ColumnMetadata('timestamp', '', 'date'),
    new ColumnMetadata('source:type', '', 'string'),
    new ColumnMetadata('ip_src_addr', '', 'ip'),
    new ColumnMetadata('enrichments:geo:ip_dst_addr:country', '', 'string'),
    new ColumnMetadata('ip_dst_addr', '', 'ip'),
    new ColumnMetadata('host', '', 'string'),
    new ColumnMetadata('alert_status', '', 'string')
  ];

  constructor(private http: Http) {
  }

  public escalate(alerts: Alert[]): Observable<null> {
    return this.http.post('/api/v1/alert/escalate', alerts, new RequestOptions({headers: new Headers(this.defaultHeaders)}))
    .catch(HttpUtil.handleError);
  }
  

  public getDefaultAlertTableColumnNames(): Observable<ColumnMetadata[]> {
    return Observable.create(observer => {
      observer.next(JSON.parse(JSON.stringify(this.defaultColumnMetadata)));
      observer.complete();
    });
  }
}
