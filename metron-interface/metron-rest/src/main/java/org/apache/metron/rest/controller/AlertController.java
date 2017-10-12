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
package org.apache.metron.rest.controller;

import static org.apache.metron.rest.MetronRestConstants.SECURITY_ROLE_ADMIN;

import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.util.List;
import java.util.Map;
import org.apache.metron.rest.RestException;
import org.apache.metron.rest.model.alert.ColumnMetadata;
import org.apache.metron.rest.model.alert.TableMetadata;
import org.apache.metron.rest.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * The API resource that is used for alert-related operations.
 */
@RestController
@RequestMapping("/api/v1/alert")
public class AlertController {

  /**
   * Service used to interact with alerts.
   */
  @Autowired
  private AlertService alertService;

  @Autowired
  private AlertService tableMetadataService;

  @ApiOperation(value = "Escalates a list of alerts by producing it to the Kafka escalate topic")
  @ApiResponse(message = "Alerts were escalated", code = 200)
  @RequestMapping(value = "/escalate", method = RequestMethod.POST)
  ResponseEntity<Void> escalate(final @ApiParam(name = "alerts", value = "The alerts to be escalated", required = true) @RequestBody List<Map<String, Object>> alerts) throws RestException {
    alertService.escalateAlerts(alerts);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @ApiOperation(value = "Retrieves the current user's alerts profile")
  @ApiResponses(value = {@ApiResponse(message = "Alerts profile", code = 200),
      @ApiResponse(message = "The current user does not have an alerts profile", code = 404)})
  @RequestMapping(value = "/table/metadata", method = RequestMethod.GET)
  ResponseEntity<TableMetadata> get() throws RestException {
    TableMetadata tableMetadata = alertService.getTableMetadata();
    if (tableMetadata != null) {
      return new ResponseEntity<>(tableMetadata, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @Secured({"ROLE_" + SECURITY_ROLE_ADMIN})
  @ApiOperation(value = "Retrieves all users' alerts profiles.  Only users that are part of "
      + "the \"ROLE_ADMIN\" role are allowed to get all alerts profiles.")
  @ApiResponses(value = {@ApiResponse(message = "List of all alerts profiles", code = 200),
      @ApiResponse(message =
          "The current user does not have permission to get all alerts profiles", code = 403)})
  @RequestMapping(value = "/table/metadata/all", method = RequestMethod.GET)
  ResponseEntity<Iterable<TableMetadata>> findAll() throws RestException {
    return new ResponseEntity<>(alertService.findAllTableMetadata(), HttpStatus.OK);
  }

  @ApiOperation(value = "Creates or updates the current user's alerts profile")
  @ApiResponses(value = {
      @ApiResponse(message = "Alerts profile updated. Returns saved alerts profile.", code = 200),
      @ApiResponse(message = "Alerts profile created. Returns saved alerts profile.", code = 201)})
  @RequestMapping(value = "/table/metadata", method = RequestMethod.POST)
  ResponseEntity<TableMetadata> save(@ApiParam(name = "alertsProfile", value =
      "The alerts profile to be saved", required = true) @RequestBody TableMetadata tableMetadata)
      throws RestException {
    if (alertService.getTableMetadata() == null) {
      return new ResponseEntity<>(alertService.saveTableMetadata(tableMetadata), HttpStatus.CREATED);
    } else {
      return new ResponseEntity<>(alertService.saveTableMetadata(tableMetadata), HttpStatus.OK);
    }
  }

  @Secured({"ROLE_" + SECURITY_ROLE_ADMIN})
  @ApiOperation(value = "Deletes a user's alerts profile.  Only users that are part of "
      + "the \"ROLE_ADMIN\" role are allowed to delete user alerts profiles.")
  @ApiResponses(value = {@ApiResponse(message = "Alerts profile was deleted", code = 200),
      @ApiResponse(message = "The current user does not have permission to delete alerts profiles",
          code = 403),
      @ApiResponse(message = "Alerts profile could not be found", code = 404)})
  @RequestMapping(value = "/table/metadata/{user}", method = RequestMethod.DELETE)
  ResponseEntity<Void> delete(
      @ApiParam(name = "user", value = "The user whose prolife will be deleted", required = true)
      @PathVariable String user)
      throws RestException {
    if (alertService.deleteTableMetadata(user)) {
      return new ResponseEntity<>(HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation(value = "Patches the current user's alerts profile")
  @ApiResponses(value = {
      @ApiResponse(message = "Alerts profile patched. Returns patched alerts profile.", code = 200),
      @ApiResponse(message = "Alerts profile could not be found", code = 404)})
  @RequestMapping(value = "/table/metadata", method = RequestMethod.PATCH)
  ResponseEntity<TableMetadata> patch(@ApiParam(name = "patch", value =
      "The patch to be applied to the Alerts profile", required = true) @RequestBody JsonNode patch)
      throws RestException {
    TableMetadata tableMetadata = alertService.getTableMetadata();
    if (tableMetadata == null) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    } else {
      return new ResponseEntity<>(alertService.patchTableMetadata(tableMetadata, patch), HttpStatus.OK);
    }
  }

  @ApiOperation(value = "Retrieves the current user's alerts profile")
  @ApiResponses(value = {@ApiResponse(message = "Alerts profile", code = 200),
      @ApiResponse(message = "The current user does not have an alerts profile", code = 404)})
  @RequestMapping(value = "/column/metadata/all", method = RequestMethod.GET)
  ResponseEntity<List<List<ColumnMetadata>>> getAllColumnMetadata() throws RestException {
    return new ResponseEntity<>(alertService.getAllColumnMetadata(), HttpStatus.OK);
  }
}
