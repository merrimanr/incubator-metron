package org.apache.metron.rest;

import org.apache.metron.rest.util.ParserIndex;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;

public class MetronApplicationListener implements ApplicationListener<ApplicationEvent> {


  @Override
  public void onApplicationEvent(ApplicationEvent applicationEvent) {
    if (applicationEvent instanceof ApplicationReadyEvent) {
      ParserIndex.reload();
    }
  }
}
