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

import {ConfigureTableService} from '../../service/configure-table.service';
import {ColumnMetadata} from '../../model/column-metadata';

export enum AlertState {
  NEW, OPEN, ESCALATE, DISMISS, RESOLVE
}

export class ColumnMetadataWrapper {
  columnMetadata: ColumnMetadata;
  selected: boolean;

  constructor(columnMetadata: ColumnMetadata, selected: boolean) {
    this.columnMetadata = columnMetadata;
    this.selected = selected;
  }
}

@Component({
  selector: 'app-configure-table',
  templateUrl: './configure-table.component.html',
  styleUrls: ['./configure-table.component.scss']
})

export class ConfigureTableComponent implements OnInit {

  allColumns: ColumnMetadataWrapper[] = [];

  constructor(private router: Router, private configureTableService: ConfigureTableService) { }

  goBack() {
    this.router.navigateByUrl('/alerts-list');
    return false;
  }

  indexOf(columnMetadata: ColumnMetadata, configuredColumns: ColumnMetadata[]): number {
    for (let i = 0; i < configuredColumns.length; i++) {
      if (configuredColumns[i].name === columnMetadata.name) {
        return i;
      }
    }
  }

  indexToInsert(columnMetadata: ColumnMetadata, allColumns: ColumnMetadata[], configuredColumnNames: string[]): number {
    let i = 0;
    for ( ; i < allColumns.length; i++) {
      if (configuredColumnNames.indexOf(allColumns[i].name) === -1 && columnMetadata.name.localeCompare(allColumns[i].name) === -1 ) {
        break;
      }
    }
    return i;
  }

  ngOnInit() {
    this.configureTableService.getAllColumnMetadata().subscribe(results => {
      let selectedColumnMetadata = results[0].map(columnMetadata => {
        return new ColumnMetadataWrapper(columnMetadata, true)
      });
      let unselectedColumnMetadata = results[1].map(columnMetadata => {
        return new ColumnMetadataWrapper(columnMetadata, false)
      });
      this.allColumns = selectedColumnMetadata.concat(unselectedColumnMetadata);
    });
  }

  onSelectDeselectAll($event) {
    let checked = $event.target.checked;
    this.allColumns.forEach(colMetaData => colMetaData.selected = checked);
  }

  save() {
    let selectedColumns = this.allColumns.filter((mDataWrapper: ColumnMetadataWrapper) => mDataWrapper.selected)
                          .map((mDataWrapper: ColumnMetadataWrapper) => mDataWrapper.columnMetadata);

    this.configureTableService.saveColumnMetaData(selectedColumns).subscribe(() => {
      this.goBack();
    }, error => {
      console.log('Unable to save column preferences ...');
      this.goBack();
    });
  }

  selectColumn(columns: ColumnMetadataWrapper) {
    columns.selected = !columns.selected;
  }

  swapUp(index: number) {
    if (index > 0) {
      [this.allColumns[index], this.allColumns[index - 1]] = [this.allColumns[index - 1], this.allColumns[index]];
    }
  }

  swapDown(index: number) {
    if (index + 1 < this.allColumns.length) {
      [this.allColumns[index], this.allColumns[index + 1]] = [this.allColumns[index + 1], this.allColumns[index]];
    }
  }
}


