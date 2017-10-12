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
package org.apache.metron.rest.service;

import java.util.List;
import java.util.Map;
import org.apache.metron.rest.RestException;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.metron.rest.model.alert.ColumnMetadata;
import org.apache.metron.rest.model.alert.TableMetadata;

/**
 * This is a set of operations created to interact with alerts.
 */
public interface AlertService {

  void escalateAlerts(List<Map<String, Object>> alerts) throws RestException;

  TableMetadata getTableMetadata() throws RestException;

  Iterable<TableMetadata> findAllTableMetadata();

  TableMetadata saveTableMetadata(TableMetadata tableMetadata);

  boolean deleteTableMetadata(String user);

  TableMetadata patchTableMetadata(TableMetadata tableMetadata, JsonNode patch) throws RestException;

  List<List<ColumnMetadata>> getAllColumnMetadata() throws RestException;
}
