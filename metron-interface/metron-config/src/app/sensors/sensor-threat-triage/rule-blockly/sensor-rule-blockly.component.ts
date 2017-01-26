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
import {Component, OnInit, Input, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {BlocklyService} from "../../../service/blockly.service";
import {TransformationValidationService} from "../../../service/transformation-validation.service";
import {StellarFunctionDescription} from "../../../model/stellar-function-description";
import {ParseMessageRequest} from "../../../model/parse-message-request";
import {SensorParserConfigService} from "../../../service/sensor-parser-config.service";
import {SampleDataComponent} from "../../../shared/sample-data/sample-data.component";

@Component({
  selector: 'metron-config-sensor-rule-blockly',
  templateUrl: './sensor-rule-blockly.component.html',
  styleUrls: ['./sensor-rule-blockly.component.scss']
})

export class SensorRuleBlocklyComponent implements AfterViewInit {

  @Input() value: string;
  @Input() score: number;
  @Input() sensorParserConfig: string;

  @ViewChild(SampleDataComponent) sampleData: SampleDataComponent;
  @Output() onCancelBlocklyEditor: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onSubmitBlocklyEditor: EventEmitter<{}> = new EventEmitter<{}>();

  private commonFields = ['ip_src_addr', 'ip_src_port', 'ip_dst_addr', 'ip_dst_port', 'protocol', 'timestamp', 'includes_reverse_traffic'];

  private statement: string;
  private availableFields: string[] = this.commonFields;

  constructor(private sensorParserConfigService: SensorParserConfigService) { }


  ngAfterViewInit(): void {
    this.sampleData.getNextSample();
  }

  onStatementChange(statement: string): void {
    this.statement = statement;
  }

  onSave(): void {
    let rule = {};
    rule[this.statement] = this.score;
    this.onSubmitBlocklyEditor.emit(rule);
  }

  onCancel(): void {
    this.onCancelBlocklyEditor.emit(true);
  }

  onSampleDataChanged(sampleData: string) {
    let parseMessageRequest = new ParseMessageRequest();
    parseMessageRequest.sensorParserConfig = JSON.parse(JSON.stringify(this.sensorParserConfig));
    parseMessageRequest.sampleData = sampleData;
    if (parseMessageRequest.sensorParserConfig.parserConfig['patternLabel'] == null) {
      parseMessageRequest.sensorParserConfig.parserConfig['patternLabel'] = parseMessageRequest.sensorParserConfig.sensorTopic.toUpperCase();
    }
    parseMessageRequest.sensorParserConfig.parserConfig['grokPath'] = './' + parseMessageRequest.sensorParserConfig.sensorTopic;

    this.sensorParserConfigService.parseMessage(parseMessageRequest).subscribe(
        parserResult => {
          this.availableFields = Object.keys(parserResult);
        },
        error => {
          this.onSampleDataNotAvailable();
        });
  }

  onSampleDataNotAvailable() {
    this.availableFields = this.commonFields;
  }

}
