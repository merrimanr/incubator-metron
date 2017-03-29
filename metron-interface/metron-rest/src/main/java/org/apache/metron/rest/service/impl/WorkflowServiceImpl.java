/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.metron.rest.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.metron.common.utils.JSONUtils;
import org.apache.metron.rest.RestException;
import org.apache.metron.rest.service.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class WorkflowServiceImpl implements WorkflowService {

  public static final String WORKFLOW_SCRIPT_PATH = "workflow.script.path";

  private String workflowScriptPath;

  private Environment environment;

  @Autowired
  public void setEnvironment(final Environment environment) {
    this.environment = environment;
    this.workflowScriptPath = environment.getProperty(WORKFLOW_SCRIPT_PATH);
  }

  @Override
  public String start(List<Map<String, Object>> messages) throws RestException {
    String workflowResponse = runCommand(workflowScriptPath, messages);
    return workflowResponse;
  }

  protected String runCommand(String scriptPath, List<Map<String, Object>> messages) throws RestException {
    String response = "";
    try {
      String serializedMessages = JSONUtils.INSTANCE.toJSON(messages, false);
      ProcessBuilder pb = new ProcessBuilder(scriptPath, serializedMessages);
      Process process = pb.start();
      process.waitFor();
      BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
      response = reader.readLine();
    } catch (Exception e) {
      throw new RestException(e);
    }
    return response;
  }
}
