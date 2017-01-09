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
package org.apache.metron.rest.utils;

import org.apache.metron.common.dsl.Context;
import org.apache.metron.common.dsl.StellarFunctionInfo;
import org.apache.metron.common.dsl.StellarFunctions;
import org.apache.metron.common.dsl.functions.resolver.ClasspathFunctionResolver;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import static org.apache.metron.common.dsl.Context.Capabilities.STELLAR_CONFIG;

public class BlocklyUtils {

  public static void main(String[] args) {
    String outputPath = "";
    Properties properties = new Properties();
    properties.put(ClasspathFunctionResolver.STELLAR_SEARCH_INCLUDES_KEY, "org.apache.metron.*");
    Context.Builder contextBuilder = new Context.Builder()
            .with(STELLAR_CONFIG, () -> properties);
    StellarFunctions.initialize(contextBuilder.build());
    Iterable<StellarFunctionInfo> functions = StellarFunctions.FUNCTION_RESOLVER().getFunctionInfo();
    Map<String, Map<String, List<StellarFunctionInfo>>> categories = new HashMap<>();
    categories.put("Functions", new HashMap<>());
    categories.put("Validation", new HashMap<>());
    for(StellarFunctionInfo function: functions) {
      String categoryName;
      if (function.getFunction().getClass().getEnclosingClass() != null) {
        categoryName = function.getFunction().getClass().getEnclosingClass().getSimpleName();
      } else {
        Class superClass = (Class) function.getFunction().getClass().getGenericSuperclass();
        categoryName = superClass.getSimpleName();
      }
      boolean isValidation = categoryName.contains("Validation");
      if (isValidation) {
        String shortCategoryName = categoryName.replaceFirst("Validation", "");
        categories.get("Validation").putIfAbsent(shortCategoryName, new ArrayList<>());
        categories.get("Validation").get(shortCategoryName).add(function);
      } else {
        String shortCategoryName = categoryName.replaceFirst("Functions", "");
        categories.get("Functions").putIfAbsent(shortCategoryName, new ArrayList<>());
        categories.get("Functions").get(shortCategoryName).add(function);
      }
    }
    Velocity.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
    Velocity.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
    Velocity.init();

    VelocityContext categoryContext = new VelocityContext();
    categoryContext.put("categories", categories);

    StringWriter xmlStringWriter = new StringWriter();
    Template blocksTemplate = Velocity.getTemplate("stellar.blockly.xml.vm");
    blocksTemplate.merge( categoryContext, xmlStringWriter );
    System.out.println(xmlStringWriter.toString());

//    VelocityContext context = new VelocityContext();
//    context.put( "functions", functions );

//    StringWriter blocksStringWriter = new StringWriter();
//    Template blocksTemplate = Velocity.getTemplate("stellar.blocks.js.vm");
//    blocksTemplate.merge( context, blocksStringWriter );
//    System.out.println(blocksStringWriter.toString());

    //StringWriter generatorStringWriter = new StringWriter();
    //Template generatorTemplate = Velocity.getTemplate("stellar.generator.js.vm");
    //generatorTemplate.merge( context, generatorStringWriter );
    //System.out.println(generatorStringWriter.toString());
  }
}
