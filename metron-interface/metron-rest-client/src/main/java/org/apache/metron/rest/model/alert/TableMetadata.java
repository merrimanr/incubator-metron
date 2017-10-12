/**
 * Licensed to the Apache Software Foundation (ASF) under one or more contributor license
 * agreements.  See the NOTICE file distributed with this work for additional information regarding
 * copyright ownership.  The ASF licenses this file to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with the License.  You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
package org.apache.metron.rest.model.alert;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import org.apache.metron.rest.converter.JsonConverter;

@JsonIgnoreProperties({ "user"})
@Entity
public class TableMetadata {

  @Id
  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  private String user;
  private int pageSize = 25;
  private int refreshInterval = 60;
  private boolean hideResolvedAlerts = true;
  private boolean hideDismissedAlerts = true;
  @Convert(converter = JsonConverter.class)
  private List<ColumnMetadata> tableColumns;

  public String getUser() {
    return user;
  }

  public void setUser(String user) {
    this.user = user;
  }

  public int getPageSize() {
    return pageSize;
  }

  public void setPageSize(int pageSize) {
    this.pageSize = pageSize;
  }

  public int getRefreshInterval() {
    return refreshInterval;
  }

  public void setRefreshInterval(int refreshInterval) {
    this.refreshInterval = refreshInterval;
  }

  public boolean isHideResolvedAlerts() {
    return hideResolvedAlerts;
  }

  public void setHideResolvedAlerts(boolean hideResolvedAlerts) {
    this.hideResolvedAlerts = hideResolvedAlerts;
  }

  public boolean isHideDismissedAlerts() {
    return hideDismissedAlerts;
  }

  public void setHideDismissedAlerts(boolean hideDismissedAlerts) {
    this.hideDismissedAlerts = hideDismissedAlerts;
  }

  public List<ColumnMetadata> getTableColumns() {
    return tableColumns;
  }

  public void setTableColumns(
      List<ColumnMetadata> tableColumns) {
    this.tableColumns = tableColumns;
  }
}
