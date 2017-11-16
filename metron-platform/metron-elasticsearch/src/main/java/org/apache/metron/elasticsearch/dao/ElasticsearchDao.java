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
package org.apache.metron.elasticsearch.dao;

import static org.apache.metron.elasticsearch.utils.ElasticsearchUtils.INDEX_NAME_DELIMITER;

import com.google.common.base.Splitter;
import com.google.common.collect.Iterables;
import java.io.IOException;
import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.apache.metron.elasticsearch.utils.ElasticsearchUtils;
import org.apache.metron.indexing.dao.AccessConfig;
import org.apache.metron.indexing.dao.IndexDao;
import org.apache.metron.indexing.dao.search.FieldType;
import org.apache.metron.indexing.dao.search.GetRequest;
import org.apache.metron.indexing.dao.search.Group;
import org.apache.metron.indexing.dao.search.GroupOrder;
import org.apache.metron.indexing.dao.search.GroupOrderType;
import org.apache.metron.indexing.dao.search.GroupRequest;
import org.apache.metron.indexing.dao.search.GroupResponse;
import org.apache.metron.indexing.dao.search.GroupResult;
import org.apache.metron.indexing.dao.search.InvalidSearchException;
import org.apache.metron.indexing.dao.search.SearchRequest;
import org.apache.metron.indexing.dao.search.SearchResponse;
import org.apache.metron.indexing.dao.search.SearchResult;
import org.apache.metron.indexing.dao.search.SortOrder;
import org.apache.metron.indexing.dao.update.Document;
import org.elasticsearch.action.ActionWriteResponse.ShardInfo;
import org.elasticsearch.action.admin.indices.mapping.get.GetMappingsRequest;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchPhaseExecutionException;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.cluster.metadata.MappingMetaData;
import org.elasticsearch.common.collect.ImmutableOpenMap;
import org.elasticsearch.index.mapper.ip.IpFieldMapper;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.QueryStringQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.Aggregations;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.Terms.Bucket;
import org.elasticsearch.search.aggregations.bucket.terms.Terms.Order;
import org.elasticsearch.search.aggregations.bucket.terms.TermsBuilder;
import org.elasticsearch.search.aggregations.metrics.sum.Sum;
import org.elasticsearch.search.aggregations.metrics.sum.SumBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class ElasticsearchDao implements IndexDao {

  private static final Logger LOG = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
  private transient TransportClient client;
  private AccessConfig accessConfig;
  private List<String> ignoredIndices = new ArrayList<>();

  protected ElasticsearchDao(TransportClient client, AccessConfig config) {
    this.client = client;
    this.accessConfig = config;
    this.ignoredIndices.add(".kibana");
  }

  public ElasticsearchDao() {
    //uninitialized.
  }

  private static Map<String, FieldType> elasticsearchSearchTypeMap;

  static {
    Map<String, FieldType> fieldTypeMap = new HashMap<>();
    fieldTypeMap.put("string", FieldType.STRING);
    fieldTypeMap.put("ip", FieldType.IP);
    fieldTypeMap.put("integer", FieldType.INTEGER);
    fieldTypeMap.put("long", FieldType.LONG);
    fieldTypeMap.put("date", FieldType.DATE);
    fieldTypeMap.put("float", FieldType.FLOAT);
    fieldTypeMap.put("double", FieldType.DOUBLE);
    fieldTypeMap.put("boolean", FieldType.BOOLEAN);
    elasticsearchSearchTypeMap = Collections.unmodifiableMap(fieldTypeMap);
  }

  @Override
  public SearchResponse search(SearchRequest searchRequest) throws InvalidSearchException {
    return search(searchRequest, new QueryStringQueryBuilder(searchRequest.getQuery()));
  }

  /**
   * Defers to a provided {@link org.elasticsearch.index.query.QueryBuilder} for the query.
   * @param searchRequest The request defining the parameters of the search
   * @param queryBuilder The actual query to be run. Intended for if the SearchRequest requires wrapping
   * @return The results of the query
   * @throws InvalidSearchException When the query is malformed or the current state doesn't allow search
   */
  protected SearchResponse search(SearchRequest searchRequest, QueryBuilder queryBuilder) throws InvalidSearchException {
    if(client == null) {
      throw new InvalidSearchException("Uninitialized Dao!  You must call init() prior to use.");
    }
    if (searchRequest.getSize() > accessConfig.getMaxSearchResults()) {
      throw new InvalidSearchException("Search result size must be less than " + accessConfig.getMaxSearchResults());
    }
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
            .size(searchRequest.getSize())
            .from(searchRequest.getFrom())
            .query(queryBuilder)
            .trackScores(true);
    searchRequest.getSort().forEach(sortField -> searchSourceBuilder.sort(sortField.getField(), getElasticsearchSortOrder(sortField.getSortOrder())));
    Optional<List<String>> fields = searchRequest.getFields();
    if (fields.isPresent()) {
      searchSourceBuilder.fields(fields.get());
    } else {
      searchSourceBuilder.fetchSource(true);
    }
    Optional<List<String>> facetFields = searchRequest.getFacetFields();
    if (facetFields.isPresent()) {
      facetFields.get().forEach(field -> searchSourceBuilder.aggregation(new TermsBuilder(getFacentAggregationName(field)).field(field)));
    }
    String[] wildcardIndices = wildcardIndices(searchRequest.getIndices());
    org.elasticsearch.action.search.SearchResponse elasticsearchResponse;
    try {
      elasticsearchResponse = client.search(new org.elasticsearch.action.search.SearchRequest(wildcardIndices)
              .source(searchSourceBuilder)).actionGet();
    } catch (SearchPhaseExecutionException e) {
      LOG.error("Could not execute search", e);
      throw new InvalidSearchException("Could not execute search", e);
    }
    SearchResponse searchResponse = new SearchResponse();
    searchResponse.setTotal(elasticsearchResponse.getHits().getTotalHits());
    searchResponse.setResults(Arrays.stream(elasticsearchResponse.getHits().getHits()).map(searchHit ->
        getSearchResult(searchHit, fields.isPresent())).collect(Collectors.toList()));
    if (facetFields.isPresent()) {
      Map<String, FieldType> commonColumnMetadata;
      try {
        commonColumnMetadata = getColumnMetadata(searchRequest.getIndices());
      } catch (IOException e) {
        throw new InvalidSearchException(String.format("Could not get common column metadata for indices %s", Arrays.toString(searchRequest.getIndices().toArray())));
      }
      searchResponse.setFacetCounts(getFacetCounts(facetFields.get(), elasticsearchResponse.getAggregations(), commonColumnMetadata ));
    }
    return searchResponse;
  }

  @Override
  public GroupResponse group(GroupRequest groupRequest) throws InvalidSearchException {
    return group(groupRequest, new QueryStringQueryBuilder(groupRequest.getQuery()));
  }

  /**
   * Defers to a provided {@link org.elasticsearch.index.query.QueryBuilder} for the query.
   * @param groupRequest The request defining the parameters of the grouping
   * @param queryBuilder The actual query to be run. Intended for if the SearchRequest requires wrapping
   * @return The results of the query
   * @throws InvalidSearchException When the query is malformed or the current state doesn't allow search
   */
  protected GroupResponse group(GroupRequest groupRequest, QueryBuilder queryBuilder)
      throws InvalidSearchException {
    if (client == null) {
      throw new InvalidSearchException("Uninitialized Dao!  You must call init() prior to use.");
    }
    if (groupRequest.getGroups() == null || groupRequest.getGroups().size() == 0) {
      throw new InvalidSearchException("At least 1 group must be provided.");
    }
    final SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
    searchSourceBuilder.query(queryBuilder);
    searchSourceBuilder.aggregation(getGroupsTermBuilder(groupRequest, 0));
    String[] wildcardIndices = wildcardIndices(groupRequest.getIndices());
    org.elasticsearch.action.search.SearchRequest request;
    org.elasticsearch.action.search.SearchResponse response;

    try {
      request = new org.elasticsearch.action.search.SearchRequest(wildcardIndices)
          .source(searchSourceBuilder);
      response = client.search(request).actionGet();
    } catch (SearchPhaseExecutionException e) {
      throw new InvalidSearchException("Could not execute search", e);
    }
    Map<String, FieldType> commonColumnMetadata;
    try {
      commonColumnMetadata = getColumnMetadata(groupRequest.getIndices());
    } catch (IOException e) {
      throw new InvalidSearchException(String
          .format("Could not get common column metadata for indices %s",
              Arrays.toString(groupRequest.getIndices().toArray())));
    }
    GroupResponse groupResponse = new GroupResponse();
    groupResponse.setGroupedBy(groupRequest.getGroups().get(0).getField());
    groupResponse.setGroupResults(
        getGroupResults(groupRequest, 0, response.getAggregations(), commonColumnMetadata));
    return groupResponse;
  }

  private String[] wildcardIndices(List<String> indices) {
    return indices
            .stream()
            .map(index -> String.format("%s%s*", index, INDEX_NAME_DELIMITER))
            .toArray(value -> new String[indices.size()]);
  }

  @Override
  public synchronized void init(AccessConfig config) {
    if(this.client == null) {
      this.client = ElasticsearchUtils.getClient(config.getGlobalConfigSupplier().get(), config.getOptionalSettings());
      this.accessConfig = config;
    }
  }

  @Override
  public Document getLatest(final String guid, final String sensorType) throws IOException {
    Optional<Document> ret = searchByGuid(
            guid
            , sensorType
            , hit -> {
              Long ts = 0L;
              String doc = hit.getSourceAsString();
              String sourceType = Iterables.getFirst(Splitter.on("_doc").split(hit.getType()), null);
              try {
                return Optional.of(new Document(doc, guid, sourceType, ts));
              } catch (IOException e) {
                throw new IllegalStateException("Unable to retrieve latest: " + e.getMessage(), e);
              }
            }
            );
    return ret.orElse(null);
  }

  @Override
  public Iterable<Document> getAllLatest(
      final List<GetRequest> getRequests) throws IOException {
    Collection<String> guids = new HashSet<>();
    Collection<String> sensorTypes = new HashSet<>();
    for (GetRequest getRequest: getRequests) {
      guids.add(getRequest.getGuid());
      sensorTypes.add(getRequest.getSensorType());
    }
    List<Document> documents = searchByGuids(
        guids
        , sensorTypes
        , hit -> {
          Long ts = 0L;
          String doc = hit.getSourceAsString();
          String sourceType = Iterables.getFirst(Splitter.on("_doc").split(hit.getType()), null);
          try {
            return Optional.of(new Document(doc, hit.getId(), sourceType, ts));
          } catch (IOException e) {
            throw new IllegalStateException("Unable to retrieve latest: " + e.getMessage(), e);
          }
        }

    );
    return documents;
  }

  <T> Optional<T> searchByGuid(String guid, String sensorType,
      Function<SearchHit, Optional<T>> callback) {
    Collection<String> sensorTypes = sensorType != null ? Collections.singleton(sensorType) : null;
    List<T> results = searchByGuids(Collections.singleton(guid), sensorTypes, callback);
    if (results.size() > 0) {
      return Optional.of(results.get(0));
    } else {
      return Optional.empty();
    }
  }

  /**
   * Return the search hit based on the UUID and sensor type.
   * A callback can be specified to transform the hit into a type T.
   * If more than one hit happens, the first one will be returned.
   */
  <T> List<T> searchByGuids(Collection<String> guids, Collection<String> sensorTypes,
      Function<SearchHit, Optional<T>> callback) {
    QueryBuilder query;
    if (sensorTypes != null) {
      String[] types = sensorTypes.stream().map(sensorType -> sensorType + "_doc").toArray(String[]::new);
      query = QueryBuilders.idsQuery(types).ids(guids);
    } else {
      query = QueryBuilders.idsQuery().ids(guids);
    }
    SearchRequestBuilder request = client.prepareSearch()
                                         .setQuery(query)
                                         .setSource("message")
                                         .setSize(guids.size())
                                         ;
    org.elasticsearch.action.search.SearchResponse response = request.get();
    SearchHits hits = response.getHits();
    List<T> results = new ArrayList<>();
    for (SearchHit hit : hits) {
      Optional<T> result = callback.apply(hit);
      if (result.isPresent()) {
        results.add(result.get());
      }
    }
    return results;
  }

  @Override
  public void update(Document update, Optional<String> index) throws IOException {
    String indexPostfix = ElasticsearchUtils
        .getIndexFormat(accessConfig.getGlobalConfigSupplier().get()).format(new Date());
    String sensorType = update.getSensorType();
    String indexName = getIndexName(update, index, indexPostfix);

    IndexRequest indexRequest = buildIndexRequest(update, sensorType, indexName);
    try {
      IndexResponse response = client.index(indexRequest).get();

      ShardInfo shardInfo = response.getShardInfo();
      int failed = shardInfo.getFailed();
      if (failed > 0) {
        throw new IOException(
            "ElasticsearchDao index failed: " + Arrays.toString(shardInfo.getFailures()));
      }
    } catch (Exception e) {
      throw new IOException(e.getMessage(), e);
    }
  }

  @Override
  public void batchUpdate(Map<Document, Optional<String>> updates) throws IOException {
    String indexPostfix = ElasticsearchUtils
        .getIndexFormat(accessConfig.getGlobalConfigSupplier().get()).format(new Date());

    BulkRequestBuilder bulkRequestBuilder = client.prepareBulk();

    // Get the indices we'll actually be using for each Document.
    for (Map.Entry<Document, Optional<String>> updateEntry : updates.entrySet()) {
      Document update = updateEntry.getKey();
      String sensorType = update.getSensorType();
      String indexName = getIndexName(update, updateEntry.getValue(), indexPostfix);
      IndexRequest indexRequest = buildIndexRequest(
          update,
          sensorType,
          indexName
      );

      bulkRequestBuilder.add(indexRequest);
    }

    BulkResponse bulkResponse = bulkRequestBuilder.get();
    if (bulkResponse.hasFailures()) {
      LOG.error("Bulk Request has failures: {}", bulkResponse.buildFailureMessage());
      throw new IOException(
          "ElasticsearchDao upsert failed: " + bulkResponse.buildFailureMessage());
    }
  }

  protected String getIndexName(Document update, Optional<String> index, String indexPostFix) {
      return index.orElse(getIndexName(update.getGuid(), update.getSensorType())
                  .orElse(ElasticsearchUtils.getIndexName(update.getSensorType(), indexPostFix, null))
      );
  }

  protected Optional<String> getIndexName(String guid, String sensorType) {
    return searchByGuid(guid,
        sensorType,
        hit -> Optional.ofNullable(hit.getIndex())
    );
  }

  protected IndexRequest buildIndexRequest(Document update, String sensorType, String indexName) {
    String type = sensorType + "_doc";
    Object ts = update.getTimestamp();
    IndexRequest indexRequest = new IndexRequest(indexName, type, update.getGuid())
        .source(update.getDocument())
        ;
    if(ts != null) {
      indexRequest = indexRequest.timestamp(ts.toString());
    }

    return indexRequest;
  }

  @SuppressWarnings("unchecked")
  @Override
  public Map<String, FieldType> getColumnMetadata(List<String> indices) throws IOException {
    Map<String, FieldType> indexColumnMetadata = new HashMap<>();

    // Keep track of the last index used to inspect a field type so we can print a helpful error message on type mismatch
    Map<String, String> previousIndices = new HashMap<>();
    // If we have detected a field type mismatch, ignore the field going forward since the type has been set to OTHER
    Set<String> fieldBlackList = new HashSet<>();

    String[] latestIndices = getLatestIndices(indices);
    ImmutableOpenMap<String, ImmutableOpenMap<String, MappingMetaData>> mappings = client
            .admin()
            .indices()
            .getMappings(new GetMappingsRequest().indices(latestIndices))
            .actionGet()
            .getMappings();
    for(Object key: mappings.keys().toArray()) {
      String indexName = key.toString();
      ImmutableOpenMap<String, MappingMetaData> mapping = mappings.get(indexName);
      Iterator<String> mappingIterator = mapping.keysIt();
      while(mappingIterator.hasNext()) {
        MappingMetaData mappingMetaData = mapping.get(mappingIterator.next());
        Map<String, Map<String, String>> map = (Map<String, Map<String, String>>) mappingMetaData.getSourceAsMap().get("properties");
        for(String field: map.keySet()) {
          if (!fieldBlackList.contains(field)) {
            FieldType type = elasticsearchSearchTypeMap.getOrDefault(map.get(field).get("type"), FieldType.OTHER);
            if (indexColumnMetadata.containsKey(field)) {
              FieldType previousType = indexColumnMetadata.get(field);
              if (!type.equals(previousType)) {
                String previousIndexName = previousIndices.get(field);
                LOG.error(String.format("Field type mismatch: %s.%s has type %s while %s.%s has type %s.  Defaulting type to %s.",
                    indexName, field, type.getFieldType(),
                    previousIndexName, field, previousType.getFieldType(), FieldType.OTHER.getFieldType()));
                indexColumnMetadata.put(field, FieldType.OTHER);
                // Detected a type mismatch so ignore the field from now on
                fieldBlackList.add(field);
              }
            } else {
              indexColumnMetadata.put(field, type);
              previousIndices.put(field, indexName);
            }
          }
        }
      }
    }
    return indexColumnMetadata;
  }

  protected String[] getLatestIndices(List<String> includeIndices) {
    Map<String, String> latestIndices = new HashMap<>();
    String[] indices = client.admin().indices().prepareGetIndex().setFeatures().get().getIndices();
    for (String index : indices) {
      if (!ignoredIndices.contains(index)) {
        int prefixEnd = index.indexOf(INDEX_NAME_DELIMITER);
        if (prefixEnd != -1) {
          String prefix = index.substring(0, prefixEnd);
          if (includeIndices.contains(prefix)) {
            String latestIndex = latestIndices.get(prefix);
            if (latestIndex == null || index.compareTo(latestIndex) > 0) {
              latestIndices.put(prefix, index);
            }
          }
        }
      }
    }
    return latestIndices.values().toArray(new String[latestIndices.size()]);
  }

  private org.elasticsearch.search.sort.SortOrder getElasticsearchSortOrder(
      org.apache.metron.indexing.dao.search.SortOrder sortOrder) {
    return sortOrder == org.apache.metron.indexing.dao.search.SortOrder.DESC ?
        org.elasticsearch.search.sort.SortOrder.DESC : org.elasticsearch.search.sort.SortOrder.ASC;
  }

  private Order getElasticsearchGroupOrder(GroupOrder groupOrder) {
    if (groupOrder.getGroupOrderType() == GroupOrderType.TERM) {
      return groupOrder.getSortOrder() == SortOrder.ASC ? Order.term(true) : Order.term(false);
    } else {
      return groupOrder.getSortOrder() == SortOrder.ASC ? Order.count(true) : Order.count(false);
    }
  }

  public Map<String, Map<String, Long>> getFacetCounts(List<String> fields, Aggregations aggregations, Map<String, FieldType> commonColumnMetadata) {
    Map<String, Map<String, Long>> fieldCounts = new HashMap<>();
    for (String field: fields) {
      Map<String, Long> valueCounts = new HashMap<>();
      Aggregation aggregation = aggregations.get(getFacentAggregationName(field));
      if (aggregation instanceof Terms) {
        Terms terms = (Terms) aggregation;
        terms.getBuckets().stream().forEach(bucket -> valueCounts.put(formatKey(bucket.getKey(), commonColumnMetadata.get(field)), bucket.getDocCount()));
      }
      fieldCounts.put(field, valueCounts);
    }
    return fieldCounts;
  }

  private String formatKey(Object key, FieldType type) {
    if (FieldType.IP.equals(type)) {
      return IpFieldMapper.longToIp((Long) key);
    } else if (FieldType.BOOLEAN.equals(type)) {
      return (Long) key == 1 ? "true" : "false";
    } else {
      return key.toString();
    }
  }

  private TermsBuilder getGroupsTermBuilder(GroupRequest groupRequest, int index) {
    List<Group> groups = groupRequest.getGroups();
    Group group = groups.get(index);
    String aggregationName = getGroupByAggregationName(group.getField());
    TermsBuilder termsBuilder = new TermsBuilder(aggregationName)
        .field(group.getField())
        .size(accessConfig.getMaxSearchGroups())
        .order(getElasticsearchGroupOrder(group.getOrder()));
    if (index < groups.size() - 1) {
      termsBuilder.subAggregation(getGroupsTermBuilder(groupRequest, index + 1));
    }
    Optional<String> scoreField = groupRequest.getScoreField();
    if (scoreField.isPresent()) {
      termsBuilder.subAggregation(new SumBuilder(getSumAggregationName(scoreField.get())).field(scoreField.get()).missing(0));
    }
    return termsBuilder;
  }

  private List<GroupResult> getGroupResults(GroupRequest groupRequest, int index, Aggregations aggregations, Map<String, FieldType> commonColumnMetadata) {
    List<Group> groups = groupRequest.getGroups();
    String field = groups.get(index).getField();
    Terms terms = aggregations.get(getGroupByAggregationName(field));
    List<GroupResult> searchResultGroups = new ArrayList<>();
    for(Bucket bucket: terms.getBuckets()) {
      GroupResult groupResult = new GroupResult();
      groupResult.setKey(formatKey(bucket.getKey(), commonColumnMetadata.get(field)));
      groupResult.setTotal(bucket.getDocCount());
      Optional<String> scoreField = groupRequest.getScoreField();
      if (scoreField.isPresent()) {
        Sum score = bucket.getAggregations().get(getSumAggregationName(scoreField.get()));
        groupResult.setScore(score.getValue());
      }
      if (index < groups.size() - 1) {
        groupResult.setGroupedBy(groups.get(index + 1).getField());
        groupResult.setGroupResults(getGroupResults(groupRequest, index + 1, bucket.getAggregations(), commonColumnMetadata));
      }
      searchResultGroups.add(groupResult);
    }
    return searchResultGroups;
  }

  private SearchResult getSearchResult(SearchHit searchHit, boolean fieldsPresent) {
    SearchResult searchResult = new SearchResult();
    searchResult.setId(searchHit.getId());
    Map<String, Object> source;
    if (fieldsPresent) {
      source = new HashMap<>();
      searchHit.getFields().forEach((key, value) -> {
        source.put(key, value.getValues().size() == 1 ? value.getValue() : value.getValues());
      });
    } else {
      source = searchHit.getSource();
    }
    searchResult.setSource(source);
    searchResult.setScore(searchHit.getScore());
    searchResult.setIndex(searchHit.getIndex());
    return searchResult;
  }

  private String getFacentAggregationName(String field) {
    return String.format("%s_count", field);
  }

  public TransportClient getClient() {
    return client;
  }

  private String getGroupByAggregationName(String field) {
    return String.format("%s_group", field);
  }

  private String getSumAggregationName(String field) {
    return String.format("%s_score", field);
  }
}
