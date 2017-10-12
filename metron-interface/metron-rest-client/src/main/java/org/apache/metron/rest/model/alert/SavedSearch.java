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

package org.apache.metron.rest.model.alert;

import java.util.List;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import org.apache.metron.indexing.dao.search.SearchRequest;
import org.apache.metron.rest.converter.JsonConverter;

@Entity
@IdClass(UserCompositeId.class)
public class SavedSearch {

  @Id
  private String user;
  @Id
  private String name;
  private Long lastAccessed;
  @Convert(converter = JsonConverter.class)
  private SearchRequest searchRequest;
  @Convert(converter = JsonConverter.class)
  private List<ColumnMetadata> tableColumns;

  public String getUser() {
    return user;
  }

  public void setUser(String user) {
    this.user = user;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Long getLastAccessed() {
    return lastAccessed;
  }

  public void setLastAccessed(Long lastAccessed) {
    this.lastAccessed = lastAccessed;
  }

  public SearchRequest getSearchRequest() {
    return searchRequest;
  }

  public void setSearchRequest(SearchRequest searchRequest) {
    this.searchRequest = searchRequest;
  }

  public List<ColumnMetadata> getTableColumns() {
    return tableColumns;
  }

  public void setTableColumns(
      List<ColumnMetadata> tableColumns) {
    this.tableColumns = tableColumns;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    SavedSearch that = (SavedSearch) o;

    return (user != null ? user.equals(that.user) : that.user == null)
        && (name != null ? name.equals(that.name) : that.name == null)
        && (searchRequest != null ? searchRequest.equals(that.searchRequest)
        : that.searchRequest == null)
        && (tableColumns != null ? tableColumns.equals(that.tableColumns)
        : that.tableColumns == null);
  }

  @Override
  public int hashCode() {
    int result = user != null ? user.hashCode() : 0;
    result = 31 * result + (name != null ? name.hashCode() : 0);
    result = 31 * result + (searchRequest != null ? searchRequest.hashCode() : 0);
    result = 31 * result + (tableColumns != null ? tableColumns.hashCode() : 0);
    return result;
  }
}

