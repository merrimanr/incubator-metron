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
package org.apache.metron.rest.service.blockly;

import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.TokenStream;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.metron.common.dsl.Context;
import org.apache.metron.common.dsl.ErrorListener;
import org.apache.metron.common.dsl.StellarFunctions;
import org.apache.metron.common.dsl.functions.resolver.ClasspathFunctionResolver;
import org.apache.metron.common.stellar.generated.StellarLexer;
import org.apache.metron.common.stellar.generated.StellarParser;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import java.util.Properties;
import java.util.Stack;

import static org.apache.metron.common.dsl.Context.Capabilities.STELLAR_CONFIG;

@Service
public class BlocklyService {

  public static void main(String[] args) throws JAXBException {
    //String statement = "IS_EMAIL(sensor_type) && sensor_type == 'yaf'";
    //String statement = "foo in [ TO_LOWER('CASEY'), 'david' ]";
    String statement = "";
    BlocklyService blocklyService = new BlocklyService();
    System.out.println(blocklyService.statementToXml(statement));
  }

  public String statementToXml(String statement) throws JAXBException {
    ANTLRInputStream input = new ANTLRInputStream(statement);
    StellarLexer lexer = new StellarLexer(input);
    lexer.removeErrorListeners();
    lexer.addErrorListener(new ErrorListener());
    TokenStream tokens = new CommonTokenStream(lexer);
    StellarParser parser = new StellarParser(tokens);

    Properties properties = new Properties();
    properties.put(ClasspathFunctionResolver.STELLAR_SEARCH_INCLUDES_KEY, "org.apache.metron.*");
    Context.Builder contextBuilder = new Context.Builder()
            .with(STELLAR_CONFIG, () -> properties);
    StellarFunctions.initialize(contextBuilder.build());
    BlocklyCompiler blocklyCompiler = new BlocklyCompiler(null, StellarFunctions.FUNCTION_RESOLVER(), Context.EMPTY_CONTEXT(), new Stack<>());
    parser.addParseListener(blocklyCompiler);
    parser.removeErrorListeners();
    parser.addErrorListener(new ErrorListener());
    parser.transformation();
    JAXBContext context = JAXBContext.newInstance(Xml.class);
    Marshaller marshaller = context.createMarshaller();
    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    Xml xml = blocklyCompiler.getXml();
    xml.getBlocks().get(0).withX("10").withY("10");
    marshaller.marshal(xml, byteArrayOutputStream);
    return byteArrayOutputStream.toString();
  }
}
