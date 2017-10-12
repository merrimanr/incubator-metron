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

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.util.List;
import org.apache.metron.rest.RestException;
import org.apache.metron.rest.model.alert.SavedSearch;
import org.apache.metron.rest.service.SavedSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * The API resource that is used for alert-related operations.
 */
@RestController
@RequestMapping("/api/v1/saved/search")
public class SavedSearchController {

  /**
   * Service used to interact with alerts.
   */
  @Autowired
  private SavedSearchService savedSearchService;

  @ApiOperation(value = "Escalates a list of alerts by producing it to the Kafka escalate topic")
  @ApiResponse(message = "Alerts were escalated", code = 200)
  @RequestMapping(method = RequestMethod.POST)
  ResponseEntity<SavedSearch> save(final @ApiParam(name = "alerts", value = "The alerts to be escalated", required = true) @RequestBody SavedSearch savedSearch) throws RestException {
    if (savedSearchService.findOne(savedSearch.getName()) == null) {
      return new ResponseEntity<>(savedSearchService.save(savedSearch), HttpStatus.CREATED);
    } else {
      return new ResponseEntity<>(savedSearchService.save(savedSearch), HttpStatus.OK);
    }
  }

  @ApiOperation(value = "Retrieves the current user's alerts profile")
  @ApiResponses(value = {@ApiResponse(message = "Alerts profile", code = 200),
      @ApiResponse(message = "The current user does not have an alerts profile", code = 404)})
  @RequestMapping(method = RequestMethod.GET)
  ResponseEntity<List<SavedSearch>> getAll() throws RestException {
    List<SavedSearch> savedSearches = savedSearchService.getAll();
    if (savedSearches != null) {
      return new ResponseEntity<>(savedSearches, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation(value = "Retrieves all users' alerts profiles.  Only users that are part of "
      + "the \"ROLE_ADMIN\" role are allowed to get all alerts profiles.")
  @ApiResponses(value = {@ApiResponse(message = "List of all alerts profiles", code = 200),
      @ApiResponse(message =
          "The current user does not have permission to get all alerts profiles", code = 403)})
  @RequestMapping(value = "/{name}", method = RequestMethod.DELETE)
  ResponseEntity<Void> delete(@ApiParam(name="name", value="SensorIndexingConfig name", required=true)@PathVariable String name) throws RestException {
    if (savedSearchService.delete(name)) {
      return new ResponseEntity<>(HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
}
