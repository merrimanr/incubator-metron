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

import org.apache.metron.common.dsl.Context;
import org.apache.metron.common.dsl.FunctionMarker;
import org.apache.metron.common.dsl.ParseException;
import org.apache.metron.common.dsl.Token;
import org.apache.metron.common.dsl.VariableResolver;
import org.apache.metron.common.dsl.functions.resolver.FunctionResolver;
import org.apache.metron.common.stellar.StellarCompiler;
import org.apache.metron.common.stellar.generated.StellarParser;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class BlocklyCompiler extends StellarCompiler {

  private Xml xml = new Xml();
  final private Map<String, String[]> functionParamMap = new HashMap<>();

  public BlocklyCompiler(VariableResolver variableResolver, FunctionResolver functionResolver, Context context) {
    super(variableResolver, functionResolver, context);
    functionResolver.getFunctionInfo().forEach(stellarFunctionInfo -> functionParamMap.put(stellarFunctionInfo.getName(), stellarFunctionInfo.getParams()));
  }

  @Override
  public void exitArithExpr_plus(StellarParser.ArithExpr_plusContext ctx) {
    Token<?> right = popStack();
    Token<?> left = popStack();
    Block plusBlock = new Block().withType("stellar_arithmetic")
            .addField(new Field().withName("OP").withValue("ADD"))
            .addValue(new Value().withName("A").addBlock((Block) left.getValue()))
            .addValue(new Value().withName("B").addBlock((Block) right.getValue()));
    tokenStack.push(new Token<>(plusBlock, Block.class));
  }

  @Override
  public void exitArithExpr_minus(StellarParser.ArithExpr_minusContext ctx) {
    Token<?> right = popStack();
    Token<?> left = popStack();
    Block minusBlock = new Block().withType("stellar_arithmetic")
            .addField(new Field().withName("OP").withValue("MINUS"))
            .addValue(new Value().withName("A").addBlock((Block) left.getValue()))
            .addValue(new Value().withName("B").addBlock((Block) right.getValue()));
    tokenStack.push(new Token<>(minusBlock, Block.class));
  }

  @Override
  public void exitArithExpr_div(StellarParser.ArithExpr_divContext ctx) {
    Token<?> right = popStack();
    Token<?> left = popStack();
    Block divBlock = new Block().withType("stellar_arithmetic")
            .addField(new Field().withName("OP").withValue("DIVIDE"))
            .addValue(new Value().withName("A").addBlock((Block) left.getValue()))
            .addValue(new Value().withName("B").addBlock((Block) right.getValue()));
    tokenStack.push(new Token<>(divBlock, Block.class));
  }

  @Override
  public void exitArithExpr_mul(StellarParser.ArithExpr_mulContext ctx) {
    Token<?> right = popStack();
    Token<?> left = popStack();
    Block mulBlock = new Block().withType("stellar_arithmetic")
            .addField(new Field().withName("OP").withValue("MULTIPLY"))
            .addValue(new Value().withName("A").addBlock((Block) left.getValue()))
            .addValue(new Value().withName("B").addBlock((Block) right.getValue()));
    tokenStack.push(new Token<>(mulBlock, Block.class));
  }

  @Override
  public void exitVariable(StellarParser.VariableContext ctx) {
    Block availableFieldsBlock = new Block().withType("available_fields").addField(new Field().withName("FIELD_NAME").withValue(ctx.getText()));
    tokenStack.push(new Token<>(availableFieldsBlock, Block.class));
  }

  @Override
  public void exitStringLiteral(StellarParser.StringLiteralContext ctx) {
    Block textBlock = new Block().withType("text")
            .addField(new Field().withName("TEXT").withValue(ctx.getText().substring(1, ctx.getText().length() - 1)));
    tokenStack.push(new Token<>(textBlock, Block.class));
  }

  @Override
  public void exitLogicalExpressionAnd(StellarParser.LogicalExpressionAndContext ctx) {
    Token<?> right = popStack();
    Token<?> left = popStack();
    Block andBlock = new Block().withType("logic_operation")
            .addField(new Field().withName("OP").withValue("AND"))
            .addValue(new Value().withName("A").addBlock((Block) left.getValue()))
            .addValue(new Value().withName("B").addBlock((Block) right.getValue()));
    tokenStack.push(new Token<>(andBlock, Block.class));
  }

  @Override
  public void exitTransformationFunc(StellarParser.TransformationFuncContext ctx) {
    String functionName = ctx.getChild(0).getText();
    String[] paramNames = functionParamMap.get(functionName);
    Block functionBlock = new Block().withType("stellar_" + functionName);
    List<Object> args = getFunctionArguments(popStack());
    for(int i = 0; i < args.size(); i++) {
      String paramName = paramNames[i].replaceAll("(.*?) .*", "$1").trim().toUpperCase();
      Value value = new Value().addBlock((Block) args.get(i)).withName(paramName);
      functionBlock.addValue(value);
    }
    tokenStack.push(new Token<>(functionBlock, Object.class));
  }

  private List<Object> getFunctionArguments(Token<?> token) {
    if (token.getUnderlyingType().equals(List.class)) {
      return (List<Object>) token.getValue();

    } else {
      throw new ParseException("Unable to process in clause because " + token.getValue() + " is not a set");
    }
  }

  @Override
  public void exitFunc_args(StellarParser.Func_argsContext ctx) {
    LinkedList<Object> args = new LinkedList<>();
    while (true) {
      Token<?> token = popStack();
      if (token.getUnderlyingType().equals(FunctionMarker.class)) {
        break;
      } else {
        args.addFirst(token.getValue());
      }
    }
    tokenStack.push(new Token<>(args, List.class));
  }

  @Override
  public void exitComparisonExpressionWithOperator(StellarParser.ComparisonExpressionWithOperatorContext ctx) {
    String op = ctx.getChild(1).getText();
    Token<?> right = popStack();
    Token<?> left = popStack();
    Block compareBlock = new Block().withType("logic_compare")
            .addValue(new Value().withName("A").addBlock((Block) left.getValue()))
            .addValue(new Value().withName("B").addBlock((Block) right.getValue()));
    Field operatorField = new Field().withName("OP");
    if (op.equals("==")) {
      operatorField.withValue("EQ");
    } else if (op.equals("!=")) {
      operatorField.withValue("NEQ");
    } else if (op.equals("<")) {
      operatorField.withValue("LT");
    } else if (op.equals(">")) {
      operatorField.withValue("GT");
    } else if (op.equals(">=")) {
      operatorField.withValue("GTE");
    } else {
      operatorField.withValue("LTE");
    }
    compareBlock.addField(operatorField);
    tokenStack.push(new Token<>(compareBlock, Block.class));
  }

  public Xml getXml() {
    xml.addBlock((Block) popStack().getValue());
    return this.xml;
  }
}
