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

import java.util.Date;
import java.util.List;
import org.apache.metron.rest.model.alert.SavedSearch;
import org.apache.metron.rest.model.alert.UserCompositeId;
import org.apache.metron.rest.repository.SavedSearchRepository;
import org.apache.metron.rest.security.SecurityUtils;
import org.apache.metron.rest.service.SavedSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

@Service
public class SavedSearchServiceImpl implements SavedSearchService {

  private SavedSearchRepository savedSearchRepository;

  @Autowired
  public SavedSearchServiceImpl(SavedSearchRepository savedSearchRepository) {
    this.savedSearchRepository = savedSearchRepository;
  }

  @Override
  public SavedSearch findOne(String name) {
    return savedSearchRepository.findOne(new UserCompositeId(SecurityUtils.getCurrentUser(), name));
  }

  @Override
  public List<SavedSearch> getAll() {
    return savedSearchRepository.findByUserOrderByLastAccessedDesc(SecurityUtils.getCurrentUser());
  }

  @Override
  public SavedSearch save(SavedSearch savedSearch) {
    savedSearch.setUser(SecurityUtils.getCurrentUser());
    if (savedSearch.getLastAccessed() == null) {
      savedSearch.setLastAccessed(new Date().getTime());
    }
    return savedSearchRepository.save(savedSearch);
  }

  @Override
  public boolean delete(String name) {
    boolean success = true;
    try {
      savedSearchRepository.delete(new UserCompositeId(SecurityUtils.getCurrentUser(), name));
    } catch (EmptyResultDataAccessException e) {
      success = false;
    }
    return success;
  }
}
