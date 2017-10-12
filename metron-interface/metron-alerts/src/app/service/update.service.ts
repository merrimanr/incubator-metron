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
import {Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/onErrorResumeNext';

import {HttpUtil} from '../utils/httpUtil';
import {Alert} from '../model/alert';
import {Http} from '@angular/http';
import {PatchRequest} from '../model/patch-request';

@Injectable()
export class UpdateService {

  defaultHeaders = {'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'};


  constructor(private http: Http) { }

  public patch(patchRequest: PatchRequest): Observable<{}> {
    let url = '/api/v1/update/patch';
    return this.http.patch(url, patchRequest, new RequestOptions({headers: new Headers(this.defaultHeaders)}))
    .catch(HttpUtil.handleError);
  }

  public updateAlertState(alerts: Alert[], state: string): Observable<{}> {
    let patchRequests: PatchRequest[] = alerts.map(alert => {
      let patchRequest = new PatchRequest();
      patchRequest.guid = alert.id;
      patchRequest.sensorType = alert.source['source:type'];
      patchRequest.patch = [{'op': 'add', 'path': '/alert_status', 'value': state}];
      return patchRequest;
    });
    let patchObservables = [];
    for (let patchRequest of patchRequests) {
      patchObservables.push(this.patch(patchRequest));
    }
    return Observable.forkJoin(patchObservables);
  }
}
