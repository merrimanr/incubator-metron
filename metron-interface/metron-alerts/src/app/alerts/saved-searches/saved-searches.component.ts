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
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';

import {SavedSearchService} from '../../service/saved-search.service';
import {SavedSearch} from '../../model/saved-search';
import {MetronDialogBox} from '../../shared/metron-dialog-box';
import {NUM_SAVED_SEARCH} from '../../utils/constants';
import {CollapseComponentData, CollapseComponentDataItems} from '../../shared/collapse/collapse-component-data';

@Component({
  selector: 'app-saved-searches',
  templateUrl: './saved-searches.component.html',
  styleUrls: ['./saved-searches.component.scss']
})
export class SavedSearchesComponent implements OnInit {

  searches: SavedSearch[];
  recentSearcheObj: SavedSearch[];
  savedSearches: CollapseComponentData = new CollapseComponentData();
  recentSearches: CollapseComponentData = new CollapseComponentData();
  constructor(private router: Router,
              private savedSearchService: SavedSearchService,
              private metronDialog: MetronDialogBox) {
  }

  ngOnInit() {
    Observable.forkJoin(
      this.savedSearchService.listSavedSearches(),
      this.savedSearchService.listRecentSearches()
    ).subscribe((response: any) => {
      this.prepareSavedSearches(response[0]);
      this.prepareRecentSearches(response[1]);
    });
  }

  prepareRecentSearches(recentSearches: SavedSearch[]) {
    this.recentSearcheObj = recentSearches || [];
    let recentSearchNames = this.recentSearcheObj.sort((s1, s2) => { return s2.lastAccessed - s1.lastAccessed; }).slice(0, NUM_SAVED_SEARCH)
    .map(search => {
      return  new CollapseComponentDataItems(search.getDisplayString());
    });

    this.recentSearches.groupName =  'Recent Searches';
    this.recentSearches.groupItems = recentSearchNames;
  }


  prepareSavedSearches(savedSearches: SavedSearch[]) {
    savedSearches = savedSearches || [];
    let savedSearchNames = savedSearches.map(savedSearch => { return new CollapseComponentDataItems(savedSearch.name); });

    this.savedSearches.groupName =  'Saved Searches';
    this.savedSearches.groupItems = savedSearchNames;
  }

  goBack() {
    this.router.navigateByUrl('/alerts-list');
    return false;
  }

  onSelectRecentSearch($event) {
    let selectedSearch = this.recentSearcheObj.find(savedSearch =>  savedSearch.name === $event.key);
    this.savedSearchService.fireLoadSavedSearch(SavedSearch.fromJSON(selectedSearch));
    this.goBack();
  }

  onSelectSavedSearch($event) {
    let selectedSearch = this.searches.find(savedSearch => savedSearch.name === $event.key);
    this.savedSearchService.fireLoadSavedSearch(SavedSearch.fromJSON(selectedSearch));
    this.goBack();
  }

  onDeleteSavedSearch($event) {
    let name = $event.key;
    this.metronDialog.showConfirmationMessage('Do you wish to delete saved search ' + name).subscribe((result: boolean) => {
      if (result) {
        this.savedSearchService.deleteSavedSearch(name).subscribe(() => {
              this.ngOnInit();
            },
            error => {
              this.ngOnInit();
            });
      }
    });
  }
}
