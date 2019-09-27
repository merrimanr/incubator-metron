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


package org.apache.metron.enrichment.bolt;

import io.jaegertracing.Configuration;
import io.jaegertracing.samplers.ConstSampler;
import io.opentracing.Scope;
import io.opentracing.Span;
import io.opentracing.SpanContext;
import io.opentracing.Tracer;
import io.opentracing.propagation.Format;
import io.opentracing.propagation.TextMap;
import io.opentracing.propagation.TextMapExtractAdapter;
import io.opentracing.util.GlobalTracer;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class TraceTest {

  private static Tracer tracer;

  public static void main(String[] args) throws InterruptedException {
    init();

    for(int i = 0; i < 5; i++) {
      Span span1 = GlobalTracer.get().buildSpan("span1 - " + i).ignoreActiveSpan().start();
      Map<String, String> traceInfo = new HashMap<>();

      Thread.sleep(100);
      span1.finish();

      attachTraceInfo(tracer, span1, traceInfo);

      Span span2 = extractTraceInfo(tracer, traceInfo, i);
      Thread.sleep(200);
      span2.finish();
    }


    int count = 0;
    while(count < 100) {
      Thread.sleep(100);
      count++;
    }
  }

  public static void init() {
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

    tracer = new Configuration("enrichment").withSampler(samplerConfig).withReporter(reporterConfig).getTracer();
    GlobalTracer.register(tracer);
  }

  protected static void attachTraceInfo(Tracer tracer, Span span, Map<String, String> map) {
    tracer.inject(span.context(), Format.Builtin.TEXT_MAP, new TextMap() {

      @Override
      public void put(String key, String value) {
        map.put(key, value);
      }

      @Override
      public Iterator<Map.Entry<String, String>> iterator() {
        throw new UnsupportedOperationException("TextMapInjectAdapter should only be used with Tracer.inject()");
      }
    });
  }

  protected static Span extractTraceInfo(Tracer tracer, Map<String, String> map, int i) {

    Tracer.SpanBuilder span = tracer.buildSpan("span2 - " + i);
    try {
      SpanContext spanContext = tracer.extract(Format.Builtin.TEXT_MAP, new TextMapExtractAdapter(map));
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
