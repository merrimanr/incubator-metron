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
import {Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {SensorEnrichmentConfig, EnrichmentConfig, ThreatIntelConfig} from '../../model/sensor-enrichment-config';

@Component({
  selector: 'metron-config-sensor-threat-triage',
  templateUrl: './sensor-threat-triage.component.html',
  styleUrls: ['./sensor-threat-triage.component.scss']
})

export class SensorThreatTriageComponent implements OnInit, OnChanges {

  @Input() showThreatTriage: boolean;
  @Input() sensorEnrichmentConfig: SensorEnrichmentConfig;

  @Output() hideThreatTriage: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  availableAggregators = ['MAX', 'SUM'];

  showRuleEditor = false;
  showRuleBlockly = false;
  currentValue: string;
  ruleValue: string;
  ruleScore: number;

  rules = [];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showThreatTriage'] && changes['showThreatTriage'].currentValue) {
      this.init();
    }
  }

  init(): void {
    this.rules = Object.keys(this.sensorEnrichmentConfig.threatIntel.triageConfig.riskLevelRules);
  }

  onClose(): void {
    this.hideThreatTriage.emit(true);
  }


  onSubmitRuleEditor(rule: {}): void {
    let ruleValue = Object.keys(rule)[0];
    delete this.sensorEnrichmentConfig.threatIntel.triageConfig.riskLevelRules[this.ruleValue];
    this.sensorEnrichmentConfig.threatIntel.triageConfig.riskLevelRules[ruleValue] = rule[ruleValue];
    this.showRuleEditor = false;
    this.init();
  }
  
  onCancelRuleEditor(): void {
    this.showRuleEditor = false;
  }
  
  onRuleEdit(rule: string) {
    this.ruleValue = rule;
    this.ruleScore = this.sensorEnrichmentConfig.threatIntel.triageConfig.riskLevelRules[rule];
    this.showRuleBlockly = false;
    this.showRuleEditor = true;
  }

  onDeleteRule(rule: string) {
    delete this.sensorEnrichmentConfig.threatIntel.triageConfig.riskLevelRules[rule];
    this.init();
  }
  
  onNewRule(): void {
    this.ruleValue = '';
    this.ruleScore = 0;
    this.showRuleEditor = true;
  }

  onSubmitRuleBlockly(rule: {}): void {
    let ruleValue = Object.keys(rule)[0];
    delete this.sensorEnrichmentConfig.threatIntel.triageConfig.riskLevelRules[this.ruleValue];
    this.sensorEnrichmentConfig.threatIntel.triageConfig.riskLevelRules[ruleValue] = rule[ruleValue];
    this.showRuleBlockly = false;
    this.init();
  }

  onCancelRuleBlockly(): void {
    this.showRuleBlockly = false;
  }

  onRuleBlockly(rule: string) {
    this.ruleValue = rule;
    this.ruleScore = this.sensorEnrichmentConfig.threatIntel.triageConfig.riskLevelRules[rule];
    this.showRuleEditor = false;
    this.showRuleBlockly = true;
  }

}
