package org.apache.metron.rest.service;

import org.apache.metron.rest.RestException;

import java.util.List;
import java.util.Map;

public interface WorkflowService {

  String start(List<Map<String, Object>> messages) throws RestException;
}
