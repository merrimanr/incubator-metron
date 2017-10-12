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
import {Injectable, } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Subject} from 'rxjs/Subject';
import {QueryBuilder} from '../alerts/alerts-list/query-builder';
import {SavedSearch} from '../model/saved-search';
import {ColumnMetadata} from '../model/column-metadata';
import {HttpUtil} from '../utils/httpUtil';
import {
    ALERTS_RECENT_SEARCH, NUM_SAVED_SEARCH
} from '../utils/constants';

@Injectable()
export class SavedSearchService {

  defaultHeaders = {'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'};

  queryBuilder: QueryBuilder;
  tableColumns: ColumnMetadata[];

  private loadSavedSearch = new Subject<SavedSearch>();
  loadSavedSearch$ = this.loadSavedSearch.asObservable();

  constructor(private http: Http) {}

  deleteRecentSearch(name: string): Observable<{}> {
    return Observable.create(observer => {
      let recentSearches: SavedSearch[] = [];
      try {
        recentSearches = JSON.parse(localStorage.getItem(ALERTS_RECENT_SEARCH));
        recentSearches = recentSearches.filter(search => search.name !== name);
      } catch (e) {}

      localStorage.setItem(ALERTS_RECENT_SEARCH, JSON.stringify(recentSearches));

      observer.next({});
      observer.complete();

    });
  }

  deleteSavedSearch(name: string): Observable<{}> {
    return this.http.delete('/api/v1/saved/search/' + name, new RequestOptions({headers: new Headers(this.defaultHeaders)}))
    .catch(HttpUtil.handleError);
  }

  fireLoadSavedSearch(savedSearch: SavedSearch) {
    this.loadSavedSearch.next(savedSearch);
  }

  listRecentSearches(): Observable<SavedSearch[]> {
    return Observable.create(observer => {
      let savedSearches: SavedSearch[] = [];
      try {
        savedSearches = JSON.parse(localStorage.getItem(ALERTS_RECENT_SEARCH));
      } catch (e) {}

      savedSearches = savedSearches || [];
      savedSearches = savedSearches.map(tSaveSeacrh => SavedSearch.fromJSON(tSaveSeacrh));

      observer.next(savedSearches);
      observer.complete();

    });
  }

  listSavedSearches(): Observable<SavedSearch[]> {
    return this.http.get('/api/v1/saved/search', new RequestOptions({headers: new Headers(this.defaultHeaders)}))
    .map(HttpUtil.extractData)
    .catch(HttpUtil.handleError);
  }

  saveRecentSearch(savedSearch: SavedSearch): Observable<{}> {
    return Observable.create(observer => {
      let savedSearches: SavedSearch[] = [];

      try {
        savedSearches = JSON.parse(localStorage.getItem(ALERTS_RECENT_SEARCH));
      } catch (e) {}

      savedSearches = savedSearches || [];
      savedSearches = savedSearches.map(tSaveSearch => SavedSearch.fromJSON(tSaveSearch));
      let index = savedSearches.map(tSaveSearch => tSaveSearch.name).indexOf(savedSearch.name);
      savedSearches.unshift(savedSearch);
      if (index !== -1) {
        savedSearches.splice(index + 1, 1);
      } else {
        if (savedSearches.length > NUM_SAVED_SEARCH) {
          savedSearches.pop();
        }
      }

      localStorage.setItem(ALERTS_RECENT_SEARCH, JSON.stringify(savedSearches));

      observer.next({});
      observer.complete();

    });
  }

  saveSearch(savedSearch: SavedSearch): Observable<{}> {
    return this.http.post('/api/v1/saved/search', savedSearch, new RequestOptions({headers: new Headers(this.defaultHeaders)}))
    .map(HttpUtil.extractData)
    .catch(HttpUtil.handleError);
  }

  setCurrentQueryBuilder(queryBuilder: QueryBuilder) {
    this.queryBuilder = queryBuilder;
  }
}
