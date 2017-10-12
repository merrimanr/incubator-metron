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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.metron.common.utils.JSONUtils;
import org.apache.metron.indexing.dao.search.FieldType;
import org.apache.metron.rest.MetronRestConstants;
import org.apache.metron.rest.RestException;
import org.apache.metron.rest.model.alert.ColumnMetadata;
import org.apache.metron.rest.model.alert.TableMetadata;
import org.apache.metron.rest.repository.TableMetadataRepository;
import org.apache.metron.rest.security.SecurityUtils;
import org.apache.metron.rest.service.AlertService;
import org.apache.metron.rest.service.KafkaService;
import org.apache.metron.rest.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

/**
 * The default service layer implementation of {@link AlertService}.
 *
 * @see AlertService
 */
@Service
public class AlertServiceImpl implements AlertService {

  private Environment environment;
  private final KafkaService kafkaService;
  private final SearchService searchService;
  private TableMetadataRepository tableMetadataRepository;

  @Autowired
  public AlertServiceImpl(final KafkaService kafkaService,
                          final SearchService searchService,
                          final Environment environment,
                          final TableMetadataRepository tableMetadataRepository) {
    this.kafkaService = kafkaService;
    this.searchService = searchService;
    this.environment = environment;
    this.tableMetadataRepository = tableMetadataRepository;
  }

  @Override
  public void escalateAlerts(List<Map<String, Object>> alerts) throws RestException {
    try {
      for (Map<String, Object> alert : alerts) {
        kafkaService.produceMessage(
            environment.getProperty(MetronRestConstants.KAFKA_TOPICS_ESCALATION_PROPERTY),
            JSONUtils.INSTANCE.toJSON(alert, false));
      }
    } catch (JsonProcessingException e) {
      throw new RestException(e);
    }
  }

  @Override
  public TableMetadata getTableMetadata() throws RestException {
    return tableMetadataRepository.findOne(SecurityUtils.getCurrentUser());
  }

  @Override
  public Iterable<TableMetadata> findAllTableMetadata() {
    return tableMetadataRepository.findAll();
  }

  @Override
  public TableMetadata saveTableMetadata(TableMetadata tableMetadata) {
    String user = SecurityUtils.getCurrentUser();
    tableMetadata.setUser(user);
    return tableMetadataRepository.save(tableMetadata);
  }

  @Override
  public boolean deleteTableMetadata(String user) {
    boolean success = true;
    try {
      tableMetadataRepository.delete(user);
    } catch (EmptyResultDataAccessException e) {
      success = false;
    }
    return success;
  }

  @Override
  public TableMetadata patchTableMetadata(TableMetadata tableMetadata, JsonNode patch) throws RestException {
    try {
      JsonNode tableMetadataNode = JSONUtils.INSTANCE.convert(tableMetadata, JsonNode.class);
      JsonNode patched = JSONUtils.INSTANCE.applyPatch(patch, tableMetadataNode);
      TableMetadata updatedTableMetadata = JSONUtils.INSTANCE.getMapper().convertValue(patched, TableMetadata.class);
      updatedTableMetadata.setUser(SecurityUtils.getCurrentUser());
      return tableMetadataRepository.save(updatedTableMetadata);
    } catch (Exception e) {
      throw new RestException(e.getMessage(), e);
    }
  }

  @Override
  public List<List<ColumnMetadata>> getAllColumnMetadata() throws RestException {
    List<ColumnMetadata> selectedColumnMetadata = getTableMetadata().getTableColumns();
    Map<String, FieldType> allColumnMetadata = searchService.getColumnMetadata(getDefaultIndices());
    List<ColumnMetadata> unselectedColumnMetadata = allColumnMetadata.entrySet()
        .stream()
        .sorted((o1, o2) -> o1.getKey().compareTo(o2.getKey()))
        .map(entry -> {
          ColumnMetadata columnMetadata = new ColumnMetadata();
          columnMetadata.setName(entry.getKey());
          columnMetadata.setType(entry.getValue());
          return columnMetadata;
        })
        .filter(columnMetadata -> !selectedColumnMetadata.contains(columnMetadata))
        .collect(Collectors.toList());
    return new ArrayList<List<ColumnMetadata>>() {{
      add(selectedColumnMetadata);
      add(unselectedColumnMetadata);
    }};
  }

  private List<String> getDefaultIndices() {
    return Arrays.asList("websphere", "snort", "asa", "bro", "yaf");
  }


}
