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

import org.apache.metron.common.dsl.Context;
import org.apache.metron.common.dsl.ParseException;
import org.apache.metron.common.dsl.StellarFunctionInfo;
import org.apache.metron.common.dsl.StellarFunctions;
import org.apache.metron.common.dsl.functions.resolver.ClasspathFunctionResolver;
import org.apache.metron.common.dsl.functions.resolver.SingletonFunctionResolver;
import org.apache.metron.common.field.transformation.FieldTransformations;
import org.apache.metron.common.stellar.StellarProcessor;
import org.apache.metron.rest.model.StellarFunctionDescription;
import org.apache.metron.rest.model.TransformationValidation;
import org.apache.metron.rest.service.GlobalConfigService;
import org.apache.metron.rest.service.TransformationService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

import static org.apache.metron.common.dsl.Context.Capabilities.GLOBAL_CONFIG;
import static org.apache.metron.common.dsl.Context.Capabilities.STELLAR_CONFIG;

@Service
public class TransformationServiceImpl implements TransformationService {

    @Autowired
    private GlobalConfigService globalConfigService;

    private List<StellarFunctionDescription> simpleStellarFunctions;
    private List<StellarFunctionDescription> stellarFunctions;
    private Map<String, List<StellarFunctionDescription>> stellarFunctionsByCategory;

    @Override
    public Map<String, Boolean> validateRules(List<String> rules) {
        Map<String, Boolean> results = new HashMap<>();
        StellarProcessor stellarProcessor = new StellarProcessor();
        for(String rule: rules) {
            try {
                boolean result = stellarProcessor.validate(rule, Context.EMPTY_CONTEXT());
                results.put(rule, result);
            } catch (ParseException e) {
                results.put(rule, false);
            }
        }
        return results;
    }

    @Override
    public Map<String, Object> validateTransformation(TransformationValidation transformationValidation) {
        JSONObject sampleJson = new JSONObject(transformationValidation.getSampleData());
        transformationValidation.getSensorParserConfig().getFieldTransformations().forEach(fieldTransformer -> {
                    fieldTransformer.transformAndUpdate(sampleJson, transformationValidation.getSensorParserConfig().getParserConfig(), Context.EMPTY_CONTEXT());
                }
        );
        return sampleJson;
    }

    @Override
    public FieldTransformations[] getTransformations() {
        return FieldTransformations.values();
    }


    private Iterable<StellarFunctionInfo> getStellarFunctionInfo() {
      Properties properties = new Properties();
      properties.put(ClasspathFunctionResolver.STELLAR_SEARCH_INCLUDES_KEY, "org.apache.metron.*");
      Context.Builder contextBuilder = new Context.Builder()
              .with(STELLAR_CONFIG, () -> properties)
              .with(GLOBAL_CONFIG, () -> {
                Map<String, Object> globalConfig = new HashMap<>();
                try {
                  return globalConfigService.get();
                } catch (Exception e) {
                  e.printStackTrace();
                }
                return globalConfig;
              });
      StellarFunctions.initialize(contextBuilder.build());
      return SingletonFunctionResolver.getInstance().getFunctionInfo();
    }

    @Override
    public List<StellarFunctionDescription> getStellarFunctions() {
      if (stellarFunctions == null) {
        stellarFunctions = new ArrayList<>();
        Iterable<StellarFunctionInfo> stellarFunctionsInfo = getStellarFunctionInfo();
        stellarFunctionsInfo.forEach(stellarFunctionInfo -> {
          String categoryName;
          if (stellarFunctionInfo.getFunction().getClass().getEnclosingClass() != null) {
            categoryName = stellarFunctionInfo.getFunction().getClass().getEnclosingClass().getSimpleName();
          } else {
            Class superClass = (Class) stellarFunctionInfo.getFunction().getClass().getGenericSuperclass();
            categoryName = superClass.getSimpleName();
          }
          boolean isValidation = categoryName.contains("Validation");
          if (isValidation) {
            categoryName = categoryName.replaceFirst("Validation", "");
          } else {
            categoryName = categoryName.replaceFirst("Functions", "");
          }
          stellarFunctions.add(new StellarFunctionDescription(
                  stellarFunctionInfo.getName(),
                  stellarFunctionInfo.getDescription(),
                  stellarFunctionInfo.getParams(),
                  stellarFunctionInfo.getReturns(),
                  categoryName));
        });
      }
      return stellarFunctions;
    }

    @Override
    public List<StellarFunctionDescription> getSimpleStellarFunctions() {
      if (simpleStellarFunctions == null) {
        List<StellarFunctionDescription> stellarFunctionDescriptions = getStellarFunctions();
        simpleStellarFunctions = stellarFunctionDescriptions.stream().filter(stellarFunctionDescription ->
                stellarFunctionDescription.getParams().length == 1).sorted((o1, o2) -> o1.getName().compareTo(o2.getName())).collect(Collectors.toList());
      }
      return simpleStellarFunctions;
    }

    @Override
    public Map<String, List<StellarFunctionDescription>> getStellarFunctionsByCategory() {
      if (stellarFunctionsByCategory == null) {
        stellarFunctionsByCategory = new HashMap<>();
        List<StellarFunctionDescription> stellarFunctions = getStellarFunctions();
        stellarFunctions.forEach(stellarFunctionDescription -> {
          String category = stellarFunctionDescription.getCategory();
          stellarFunctionsByCategory.putIfAbsent(category, new ArrayList<>());
          stellarFunctionsByCategory.get(category).add(stellarFunctionDescription);
        });
        for(String key: stellarFunctionsByCategory.keySet()) {
          Collections.sort(stellarFunctionsByCategory.get(key), (o1, o2) -> o1.getName().compareTo(o2.getName()));
        }
      }
      return stellarFunctionsByCategory;
    }

}
