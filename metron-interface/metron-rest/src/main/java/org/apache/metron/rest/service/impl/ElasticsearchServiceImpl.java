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
package org.apache.metron.rest.service.impl;

import org.apache.metron.rest.MetronRestConstants;
import org.apache.metron.rest.RestException;
import org.apache.metron.rest.model.SearchRequest;
import org.apache.metron.rest.model.SearchResponse;
import org.apache.metron.rest.model.SearchResult;
import org.apache.metron.rest.model.SortField;
import org.apache.metron.rest.service.SearchService;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.QueryStringQueryBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class ElasticsearchServiceImpl implements SearchService {

  private TransportClient client;
  private int searchMaxResults;

  @Autowired
  public ElasticsearchServiceImpl(TransportClient client, Environment environment) {
    this.client = client;
    this.searchMaxResults = Integer.parseInt(environment.getProperty(MetronRestConstants.SEARCH_MAX_RESULTS));
  }

  @Override
  public SearchResponse search(SearchRequest searchRequest) throws RestException {
    if (searchRequest.getSize() > searchMaxResults) {
      throw new RestException("Search result size must be less than " + searchMaxResults);
    }
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
            .size(searchRequest.getSize())
            .from(searchRequest.getFrom())
            .query(new QueryStringQueryBuilder(searchRequest.getQuery()))
            .fetchSource(true)
            .trackScores(true);
    for(SortField sortField: searchRequest.getSort()) {
      FieldSortBuilder fieldSortBuilder = new FieldSortBuilder(sortField.getField());
      fieldSortBuilder.order(sortField.getSortOrder() == org.apache.metron.rest.model.SortOrder.DESC ? SortOrder.DESC : SortOrder.ASC);
      searchSourceBuilder = searchSourceBuilder.sort(fieldSortBuilder);
    }
    String[] wildcardIndices = searchRequest.getIndices().stream().map(index -> String.format("%s*", index)).toArray(value -> new String[searchRequest.getIndices().size()]);
    org.elasticsearch.action.search.SearchResponse elasticsearchResponse = client.search(new org.elasticsearch.action.search.SearchRequest(wildcardIndices)
            .source(searchSourceBuilder)).actionGet();
    SearchResponse searchResponse = new SearchResponse();
    searchResponse.setTotal(elasticsearchResponse.getHits().getTotalHits());
    searchResponse.setResults(Arrays.stream(elasticsearchResponse.getHits().getHits()).map(searchHit -> {
      SearchResult searchResult = new SearchResult();
      searchResult.setId(searchHit.getId());
      searchResult.setSource(searchHit.getSource());
      searchResult.setScore(searchHit.getScore());
      return searchResult;
    }).collect(Collectors.toList()));
    return searchResponse;
  }
}
