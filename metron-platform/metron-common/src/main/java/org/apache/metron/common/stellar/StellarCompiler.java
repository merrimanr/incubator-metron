/*
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

package org.apache.metron.common.stellar;

import com.google.common.base.Joiner;
import com.google.common.collect.ImmutableSet;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.metron.common.dsl.Context;
import org.apache.metron.common.dsl.FunctionMarker;
import org.apache.metron.common.dsl.functions.resolver.FunctionResolver;
import org.apache.metron.common.dsl.ParseException;
import org.apache.metron.common.dsl.StellarFunction;
import org.apache.metron.common.dsl.Token;
import org.apache.metron.common.dsl.VariableResolver;
import org.apache.metron.common.stellar.evaluators.ArithmeticEvaluator;
import org.apache.metron.common.stellar.evaluators.NumberLiteralEvaluator;
import org.apache.metron.common.stellar.generated.StellarBaseListener;
import org.apache.metron.common.stellar.generated.StellarParser;
import org.apache.metron.common.utils.ConversionUtils;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Stack;

import static java.lang.String.format;

public class StellarCompiler extends StellarBaseListener {

  private final Context context;
  private final Stack<Token<?>> tokenStack;
  private final FunctionResolver functionResolver;
  private final VariableResolver variableResolver;
  private Throwable actualException;
  private final ArithmeticEvaluator arithmeticEvaluator;
  private final NumberLiteralEvaluator numberLiteralEvaluator;

  public StellarCompiler(VariableResolver variableResolver,
                         FunctionResolver functionResolver,
                         Context context,
                         Stack<Token<?>> tokenStack,
                         ArithmeticEvaluator arithmeticEvaluator,
                         NumberLiteralEvaluator numberLiteralEvaluator) {
    this.variableResolver = variableResolver;
    this.functionResolver = functionResolver;
    this.context = context;
    this.tokenStack = tokenStack;
    this.arithmeticEvaluator = arithmeticEvaluator;
    this.numberLiteralEvaluator = numberLiteralEvaluator;
  }

  @Override
  public void enterTransformation(StellarParser.TransformationContext ctx) {
    tokenStack.clear();
  }

  private boolean handleIn(Token<?> left, Token<?> right) {
    Object key = null;

    Set<Object> set = null;
    if (left.getValue() instanceof Collection) {
      set = new HashSet<>((List<Object>) left.getValue());
    } else if (left.getValue() != null) {
      set = ImmutableSet.of(left.getValue());
    } else {
      set = new HashSet<>();
    }

    key = right.getValue();
    if (key == null || set.isEmpty()) {
      return false;
    }
    return set.contains(key);
  }

  @Override
  public void exitNullConst(StellarParser.NullConstContext ctx) {
    tokenStack.push(new Token<>(null, Object.class));
  }

  @Override
  public void exitArithExpr_plus(StellarParser.ArithExpr_plusContext ctx) {
    Pair<Token<? extends Number>, Token<? extends Number>> p = getArithExpressionPair();
    tokenStack.push(arithmeticEvaluator.evaluate(ArithmeticEvaluator.ArithmeticEvaluatorFunctions.addition(), p));
  }

  @Override
  public void exitArithExpr_minus(StellarParser.ArithExpr_minusContext ctx) {
    Pair<Token<? extends Number>, Token<? extends Number>> p = getArithExpressionPair();
    tokenStack.push(arithmeticEvaluator.evaluate(ArithmeticEvaluator.ArithmeticEvaluatorFunctions.subtraction(), p));
  }

  @Override
  public void exitArithExpr_div(StellarParser.ArithExpr_divContext ctx) {
    Pair<Token<? extends Number>, Token<? extends Number>> p = getArithExpressionPair();
    tokenStack.push(arithmeticEvaluator.evaluate(ArithmeticEvaluator.ArithmeticEvaluatorFunctions.division(), p));
  }

  @Override
  public void exitArithExpr_mul(StellarParser.ArithExpr_mulContext ctx) {
    Pair<Token<? extends Number>, Token<? extends Number>> p = getArithExpressionPair();
    tokenStack.push(arithmeticEvaluator.evaluate(ArithmeticEvaluator.ArithmeticEvaluatorFunctions.multiplication(), p));
  }

  @SuppressWarnings("unchecked")
  private Pair<Token<? extends Number>, Token<? extends Number>> getArithExpressionPair() {
    Token<? extends Number> right = (Token<? extends Number>) popStack();
    Token<? extends Number> left = (Token<? extends Number>) popStack();
    return Pair.of(left, right);
  }

  private void handleConditional() {
    Token<?> elseExpr = popStack();
    Token<?> thenExpr = popStack();
    Token<?> ifExpr = popStack();
    boolean b = ((Token<Boolean>) ifExpr).getValue();
    if (b) {
      tokenStack.push(thenExpr);
    } else {
      tokenStack.push(elseExpr);
    }
  }

  @Override
  public void exitTernaryFuncWithoutIf(StellarParser.TernaryFuncWithoutIfContext ctx) {
    handleConditional();
  }

  @Override
  public void exitTernaryFuncWithIf(StellarParser.TernaryFuncWithIfContext ctx) {
    handleConditional();
  }

  @Override
  public void exitInExpression(StellarParser.InExpressionContext ctx) {
    Token<?> left = popStack();
    Token<?> right = popStack();
    tokenStack.push(new Token<>(handleIn(left, right), Boolean.class));
  }

  @Override
  public void exitNInExpression(StellarParser.NInExpressionContext ctx) {
    Token<?> left = popStack();
    Token<?> right = popStack();
    tokenStack.push(new Token<>(!handleIn(left, right), Boolean.class));
  }

  @Override
  public void exitNotFunc(StellarParser.NotFuncContext ctx) {
    Token<Boolean> arg = (Token<Boolean>) popStack();
    tokenStack.push(new Token<>(!arg.getValue(), Boolean.class));
  }

  @Override
  public void exitVariable(StellarParser.VariableContext ctx) {
    tokenStack.push(new Token<>(variableResolver.resolve(ctx.getText()), Object.class));
  }

  @Override
  public void exitStringLiteral(StellarParser.StringLiteralContext ctx) {
    tokenStack.push(new Token<>(ctx.getText().substring(1, ctx.getText().length() - 1), String.class));
  }

  @Override
  public void exitIntLiteral(StellarParser.IntLiteralContext ctx) {
    tokenStack.push(numberLiteralEvaluator.evaluate(ctx));
  }

  @Override
  public void exitDoubleLiteral(StellarParser.DoubleLiteralContext ctx) {
    tokenStack.push(numberLiteralEvaluator.evaluate(ctx));
  }

  @Override
  public void exitFloatLiteral(StellarParser.FloatLiteralContext ctx) {
    tokenStack.push(numberLiteralEvaluator.evaluate(ctx));
  }

  @Override
  public void exitLongLiteral(StellarParser.LongLiteralContext ctx) {
    tokenStack.push(numberLiteralEvaluator.evaluate(ctx));
  }

  @Override
  public void exitLogicalExpressionAnd(StellarParser.LogicalExpressionAndContext ctx) {
    Token<?> left = popStack();
    Token<?> right = popStack();
    tokenStack.push(new Token<>(booleanOp(left, right, (l, r) -> l && r, "&&"), Boolean.class));
  }

  @Override
  public void exitLogicalExpressionOr(StellarParser.LogicalExpressionOrContext ctx) {
    Token<?> left = popStack();
    Token<?> right = popStack();

    tokenStack.push(new Token<>(booleanOp(left, right, (l, r) -> l || r, "||"), Boolean.class));
  }

  @Override
  public void exitLogicalConst(StellarParser.LogicalConstContext ctx) {
    Boolean b = null;
    switch (ctx.getText().toUpperCase()) {
      case "TRUE":
        b = true;
        break;
      case "FALSE":
        b = false;
        break;
      default:
        throw new ParseException("Unable to process " + ctx.getText() + " as a boolean constant");
    }
    tokenStack.push(new Token<>(b, Boolean.class));
  }

  private boolean booleanOp(Token<?> left, Token<?> right, BooleanOp op, String opName) {
    Boolean l = ConversionUtils.convert(left.getValue(), Boolean.class);
    Boolean r = ConversionUtils.convert(right.getValue(), Boolean.class);
    if (l == null || r == null) {
      throw new ParseException("Unable to operate on " + left.getValue() + " " + opName + " " + right.getValue() + ", null value");
    }
    return op.op(l, r);
  }

  @Override
  public void exitTransformationFunc(StellarParser.TransformationFuncContext ctx) {

    // resolve and initialize the function
    String functionName = ctx.getChild(0).getText();
    StellarFunction function = resolveFunction(functionName);
    initializeFunction(function, functionName);

    // fetch the args, execute, and push result onto the stack
    List<Object> args = getFunctionArguments(popStack());
    try {
      Object result = function.apply(args, context);
      tokenStack.push(new Token<>(result, Object.class));
    }
    catch(Throwable t) {
      actualException = t;
    }
  }

  /**
   * Get function arguments.
   * @param token The token containing the function arguments.
   * @return
   */
  private List<Object> getFunctionArguments(Token<?> token) {
    if (token.getUnderlyingType().equals(List.class)) {
      return (List<Object>) token.getValue();

    } else {
      throw new ParseException("Unable to process in clause because " + token.getValue() + " is not a set");
    }
  }

  /**
   * Resolves a function by name.
   * @param funcName
   * @return
   */
  private StellarFunction resolveFunction(String funcName) {
    try {
      return functionResolver.apply(funcName);

    } catch (Exception e) {
      String valid = Joiner.on(',').join(functionResolver.getFunctions());
      String error = format("Unable to resolve function named '%s'.  Valid functions are %s", funcName, valid);
      throw new ParseException(error, e);
    }
  }

  /**
   * Initialize a Stellar function.
   * @param function The function to initialize.
   * @param functionName The name of the functions.
   */
  private void initializeFunction(StellarFunction function, String functionName) {
    try {
      if (!function.isInitialized()) {
        function.initialize(context);
      }
    } catch (Throwable t) {
      String error = format("Unable to initialize function '%s'", functionName);
      throw new ParseException(error, t);
    }
  }

  @Override
  public void exitExistsFunc(StellarParser.ExistsFuncContext ctx) {
    String variable = ctx.getChild(2).getText();
    boolean exists = variableResolver.resolve(variable) != null;
    tokenStack.push(new Token<>(exists, Boolean.class));
  }

  @Override
  public void enterFunc_args(StellarParser.Func_argsContext ctx) {
    tokenStack.push(new Token<>(new FunctionMarker(), FunctionMarker.class));
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
  public void enterMap_entity(StellarParser.Map_entityContext ctx) {
    tokenStack.push(new Token<>(new FunctionMarker(), FunctionMarker.class));
  }

  @Override
  public void exitMap_entity(StellarParser.Map_entityContext ctx) {
    HashMap<String, Object> args = new HashMap<>();
    Object value = null;
    for (int i = 0; true; i++) {
      Token<?> token = popStack();
      if (token.getUnderlyingType().equals(FunctionMarker.class)) {
        break;
      } else {
        if (i % 2 == 0) {
          value = token.getValue();
        } else {
          args.put(token.getValue() + "", value);
        }
      }
    }
    tokenStack.push(new Token<>(args, Map.class));
  }

  @Override
  public void exitList_entity(StellarParser.List_entityContext ctx) {
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

  private <T extends Comparable<T>> boolean compare(T l, T r, String op) {
    if (op.equals("==")) {
      return l.compareTo(r) == 0;
    } else if (op.equals("!=")) {
      return l.compareTo(r) != 0;
    } else if (op.equals("<")) {
      return l.compareTo(r) < 0;
    } else if (op.equals(">")) {
      return l.compareTo(r) > 0;
    } else if (op.equals(">=")) {
      return l.compareTo(r) >= 0;
    } else {
      return l.compareTo(r) <= 0;
    }
  }

  private boolean compareDouble(Double l, Double r, String op) {
    if (op.equals("==")) {
      return Math.abs(l - r) < 1e-6;
    } else if (op.equals("!=")) {
      return Math.abs(l - r) >= 1e-6;
    } else if (op.equals("<")) {
      return l.compareTo(r) < 0;
    } else if (op.equals(">")) {
      return l.compareTo(r) > 0;
    } else if (op.equals(">=")) {
      return l.compareTo(r) >= 0;
    } else {
      return l.compareTo(r) <= 0;
    }
  }

  @Override
  public void exitComparisonExpressionWithOperator(StellarParser.ComparisonExpressionWithOperatorContext ctx) {
    String op = ctx.getChild(1).getText();
    Token<?> right = popStack();
    Token<?> left = popStack();
    if (left.getValue() instanceof Number
            && right.getValue() instanceof Number) {
      Double l = ((Number) left.getValue()).doubleValue();
      Double r = ((Number) right.getValue()).doubleValue();
      tokenStack.push(new Token<>(compareDouble(l, r, op), Boolean.class));

    } else {
      String l = left.getValue() == null ? "" : left.getValue().toString();
      String r = right.getValue() == null ? "" : right.getValue().toString();
      tokenStack.push(new Token<>(compare(l, r, op), Boolean.class));
    }
  }

  @Override
  public void enterList_entity(StellarParser.List_entityContext ctx) {
    tokenStack.push(new Token<>(new FunctionMarker(), FunctionMarker.class));
  }

  public Token<?> popStack() {
    if (tokenStack.empty()) {
      throw new ParseException("Unable to pop an empty stack");
    }
    return tokenStack.pop();
  }

  public Object getResult() throws ParseException {
    if(actualException != null) {
      throw new ParseException("Unable to execute: " +actualException.getMessage(), actualException);
    }
    if (tokenStack.empty()) {
      throw new ParseException("Invalid predicate: Empty stack.");
    }
    Token<?> token = popStack();
    if (tokenStack.empty()) {
      return token.getValue();
    }
    if (tokenStack.empty()) {
      throw new ParseException("Invalid parse, stack not empty: " + Joiner.on(',').join(tokenStack));
    } else {
      throw new ParseException("Invalid parse, found " + token);
    }
  }
}
