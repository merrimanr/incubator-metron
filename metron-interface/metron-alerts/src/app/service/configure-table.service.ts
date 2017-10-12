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
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';
import {ColumnMetadata} from '../model/column-metadata';
import {TableMetadata} from '../model/table-metadata';
import {HttpUtil} from '../utils/httpUtil';
import {TableMetadataPatch} from "../model/table-metadata-patch";

@Injectable()
export class ConfigureTableService {

  defaultHeaders = {'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'};

  private tableMetadataChangedSource = new Subject<TableMetadata>();
  tableMetadataChanged$ = this.tableMetadataChangedSource.asObservable();

  constructor(private http: Http) {}

  getAllColumnMetadata(): Observable<ColumnMetadata[][]> {
    let url = '/api/v1/alert/column/metadata/all';
    return this.http.get(url, new RequestOptions({headers: new Headers(this.defaultHeaders)}))
    .map(HttpUtil.extractData)
    .catch(HttpUtil.handleError);
  }

  getTableMetadata(): Observable<TableMetadata> {
    let url = '/api/v1/alert/table/metadata';
    return this.http.get(url, new RequestOptions({headers: new Headers(this.defaultHeaders)}))
    .map(res => {
      if (res.status === 404) {
        return new TableMetadata();
      } else {
        return HttpUtil.extractData(res);
      }
    }).catch(HttpUtil.handleError);
  }

  saveColumnMetaData(columns: ColumnMetadata[]): Observable<TableMetadata> {
    let columnMetadataPatch = new TableMetadataPatch('/tableColumns', columns);
    let url = '/api/v1/alert/table/metadata';
    return this.http.patch(url, [columnMetadataPatch], new RequestOptions({headers: new Headers(this.defaultHeaders)}))
    .map(res => {
      let tableMetadata = HttpUtil.extractData(res);
      this.tableMetadataChangedSource.next(tableMetadata);
      return tableMetadata;
    })
    .catch(HttpUtil.handleError);
  }

  savePageSize(pageSize: number): Observable<TableMetadata> {
    let pageSizePatch = new TableMetadataPatch('/pageSize', pageSize);
    let url = '/api/v1/alert/table/metadata';
    return this.http.patch(url, [pageSizePatch], new RequestOptions({headers: new Headers(this.defaultHeaders)}))
    .map(HttpUtil.extractData)
    .catch(HttpUtil.handleError);
  }

  saveRefreshInterval(refreshInterval: number): Observable<TableMetadata> {
    let refreshIntervalPatch = new TableMetadataPatch('/refreshInterval', refreshInterval);
    let url = '/api/v1/alert/table/metadata';
    return this.http.patch(url, [refreshIntervalPatch], new RequestOptions({headers: new Headers(this.defaultHeaders)}))
    .map(HttpUtil.extractData)
    .catch(HttpUtil.handleError);
  }

  saveTableMetaData(tableMetadata: TableMetadata): Observable<TableMetadata> {
    let url = '/api/v1/alert/table/metadata';
    return this.http.post(url, tableMetadata, new RequestOptions({headers: new Headers(this.defaultHeaders)}))
    .map(HttpUtil.extractData)
    .catch(HttpUtil.handleError);
  }
}
