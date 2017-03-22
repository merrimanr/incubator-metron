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
import {Component, Input, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import {SensorParserConfig} from '../../model/sensor-parser-config';
import {SensorEnrichmentConfig, EnrichmentConfig, ThreatIntelConfig} from '../../model/sensor-enrichment-config';
import {SensorIndexingConfig} from '../../model/sensor-indexing-config';

declare var ace: any;

@Component({
  selector: 'metron-config-sensor-raw-json',
  templateUrl: './sensor-raw-json.component.html',
  styleUrls: ['./sensor-raw-json.component.scss']
})

export class SensorRawJsonComponent implements OnChanges {

  @Input() showRawJson: boolean;
  @Input() sensorParserConfig: SensorParserConfig;
  @Input() sensorEnrichmentConfig: SensorEnrichmentConfig;
  @Input() sensorIndexingConfig: SensorIndexingConfig;

  @Output() hideRawJson: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onRawJsonChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  newSensorParserConfig: string;
  newSensorEnrichmentConfig: string;
  newSensorIndexingConfig: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showRawJson'] && changes['showRawJson'].currentValue) {
      this.init();
    }
  }

  init(): void {
    if (this.sensorParserConfig) {
      this.newSensorParserConfig = JSON.stringify(this.sensorParserConfig);
    }

    if (this.sensorEnrichmentConfig) {
      this.newSensorEnrichmentConfig = JSON.stringify(this.sensorEnrichmentConfig);
    }

    if (this.sensorIndexingConfig) {
      this.newSensorIndexingConfig = JSON.stringify(this.sensorIndexingConfig);
    }
  }

  onSave() {
    let newParsedSensorParserConfig = JSON.parse(this.newSensorParserConfig);
    this.sensorParserConfig.sensorTopic = newParsedSensorParserConfig.sensorTopic;
    this.sensorParserConfig.parserConfig = newParsedSensorParserConfig.parserConfig;
    this.sensorParserConfig.parserClassName = newParsedSensorParserConfig.parserClassName;
    this.sensorParserConfig.fieldTransformations = newParsedSensorParserConfig.fieldTransformations;

    if (newParsedSensorParserConfig.writerClassName != null) {
      this.sensorParserConfig.writerClassName = newParsedSensorParserConfig.writerClassName;
    }
    if (newParsedSensorParserConfig.errorWriterClassName != null) {
      this.sensorParserConfig.errorWriterClassName = newParsedSensorParserConfig.errorWriterClassName;
    }
    if (newParsedSensorParserConfig.filterClassName != null) {
      this.sensorParserConfig.filterClassName = newParsedSensorParserConfig.filterClassName;
    }
    if (newParsedSensorParserConfig.invalidWriterClassName != null) {
      this.sensorParserConfig.invalidWriterClassName = newParsedSensorParserConfig.invalidWriterClassName;
    }

    let newParsedSensorEnrichmentConfig = JSON.parse(this.newSensorEnrichmentConfig);
    this.sensorEnrichmentConfig.enrichment = Object.assign(new EnrichmentConfig(), newParsedSensorEnrichmentConfig.enrichment);
    this.sensorEnrichmentConfig.threatIntel = Object.assign(new ThreatIntelConfig(), newParsedSensorEnrichmentConfig.threatIntel);
    if (newParsedSensorEnrichmentConfig.configuration != null) {
      this.sensorEnrichmentConfig.configuration = newParsedSensorEnrichmentConfig.configuration;
    }

    let newParsedSensorIndexingConfig = JSON.parse(this.newSensorIndexingConfig);
    this.sensorIndexingConfig.batchSize = newParsedSensorIndexingConfig.batchSize;
    this.sensorIndexingConfig.index = newParsedSensorIndexingConfig.index;

    this.hideRawJson.emit(true);
    this.onRawJsonChanged.emit(true);
  }

  onCancel(): void {
    this.hideRawJson.emit(true);
  }
}
