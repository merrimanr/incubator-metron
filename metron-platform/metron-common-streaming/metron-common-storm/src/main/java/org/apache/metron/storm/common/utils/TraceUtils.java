/*
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


package org.apache.metron.storm.common.utils;

import io.jaegertracing.Configuration;
import io.jaegertracing.samplers.ConstSampler;
import io.opentracing.Span;
import io.opentracing.SpanContext;
import io.opentracing.Tracer;
import io.opentracing.propagation.Format;
import io.opentracing.propagation.TextMap;
import io.opentracing.propagation.TextMapExtractAdapter;
import io.opentracing.util.GlobalTracer;
import org.json.simple.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Optional;

public class TraceUtils {

  public static final String TRACE_INFO_FIELD = "trace_info";
  private static final Object tracerRegisterLock = new Object();

  public static void createTracer(String name, Map<String, Object> globalConfig) {
    synchronized (tracerRegisterLock) {
      if (!GlobalTracer.isRegistered()) {
        Configuration.SamplerConfiguration samplerConfig = new Configuration.SamplerConfiguration()
                .withType(ConstSampler.TYPE)
                .withParam(1);
        Configuration.SenderConfiguration senderConfig = new Configuration.SenderConfiguration()
                .withAgentHost("node1")
                .withAgentPort(Integer.decode("5775"));
        Configuration.ReporterConfiguration reporterConfig = new Configuration.ReporterConfiguration()
                .withLogSpans(true)
                .withFlushInterval(1000)
                .withMaxQueueSize(10000)
                .withSender(senderConfig);
        Tracer tracer = new Configuration(name).withSampler(samplerConfig).withReporter(reporterConfig).getTracer();
        GlobalTracer.register(tracer);
      }
    }
  }

  public static Span createSpan(String name) {
    return GlobalTracer.get().buildSpan(name).start();
  }

  public static Optional<Span> getSpan(String name, JSONObject message) {
    Optional<Span> span = Optional.empty();
    if (message.containsKey(TRACE_INFO_FIELD)) {
      span = Optional.of(TraceUtils.extractTraceInfo(name, message));
    }
    return span;
  }

  public static void attachTraceInfo(Span span, JSONObject message) {
    Map<String, String> traceInfo = new HashMap<>();
    GlobalTracer.get().inject(span.context(), Format.Builtin.TEXT_MAP, new TextMap() {

      @Override
      public void put(String key, String value) {
        traceInfo.put(key, value);
      }

      @Override
      public Iterator<Map.Entry<String, String>> iterator() {
        throw new UnsupportedOperationException("TextMapInjectAdapter should only be used with Tracer.inject()");
      }
    });
    message.put(TRACE_INFO_FIELD, traceInfo);
  }

  public static Span extractTraceInfo(String name, JSONObject message) {
    Map<String, String> traceInfo = (Map<String, String>) message.get(TRACE_INFO_FIELD);
    Tracer tracer = GlobalTracer.get();
    Tracer.SpanBuilder span = tracer.buildSpan(name);
    try {
      SpanContext spanContext = tracer.extract(Format.Builtin.TEXT_MAP, new TextMapExtractAdapter(traceInfo));
      if (spanContext != null) {
        //if spanContext is extracted, the spanContext is propagated to the new span
        span.asChildOf(spanContext);
      }
    } catch (Exception e) {
      span.withTag("Error", "extract from request fail, error msg:" + e.getMessage());
    }
    return span.start();
  }
}
