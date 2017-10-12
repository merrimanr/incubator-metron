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
import {ColumnMetadata} from '../model/column-metadata';
import {SearchResponse} from '../model/search-response';

export class ElasticsearchUtils {

  public static excludeIndexName = ',-*kibana,-error*';

  // private static createColumMetaData(properties: any, columnMetadata: ColumnMetadata[], seen: string[]) {
  //    try {
  //      let columnNames = Object.keys(properties);
  //      for (let columnName of columnNames) {
  //        if (seen.indexOf(columnName) === -1) {
  //          seen.push(columnName);
  //          columnMetadata.push(
  //            new ColumnMetadata(columnName, (properties[columnName].type ? properties[columnName].type : ''))
  //          );
  //        }
  //      }
  //    } catch (e) {}
  // }

  // public static extractColumnNameData(res: Response): ColumnMetadata[] {
  //   let response: any = res || {};
  //   let columnMetadata: ColumnMetadata[] = [];
  //   let seen: string[] = [];
  //
  //   for (let index in response.metadata.indices) {
  //     if (!index.endsWith(ElasticsearchUtils.excludeIndexName)) {
  //       let mappings = response.metadata.indices[index].mappings;
  //       for (let type of Object.keys(mappings)) {
  //         ElasticsearchUtils.createColumMetaData(response.metadata.indices[index].mappings[type].properties, columnMetadata, seen);
  //       }
  //     }
  //   }
  //
  //   columnMetadata.push(new ColumnMetadata('id', 'string'));
  //   return columnMetadata;
  // }
  //
  // public static extractAlertsData(res: Response): SearchResponse {
  //   let response: any = res || {};
  //   let alertsSearchResponse: SearchResponse = new SearchResponse();
  //   alertsSearchResponse.total = response['hits']['total'];
  //   alertsSearchResponse.results = response['hits']['hits'];
  //   return alertsSearchResponse;
  // }
  //
  public static extractESErrorMessage(error: any): any {
    let message = error.error.reason;
    error.error.root_cause.map(cause => {
      message += '\n' + cause.index + ': ' + cause.reason;
    });

    return message;
  }

}
