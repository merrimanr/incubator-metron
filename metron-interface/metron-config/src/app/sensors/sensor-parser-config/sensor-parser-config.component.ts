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
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {SensorParserConfig} from '../../model/sensor-parser-config';
import {SensorParserConfigService} from '../../service/sensor-parser-config.service';
import {Router, ActivatedRoute} from '@angular/router';
import {MetronAlerts} from '../../shared/metron-alerts';
import {TransformationValidation} from '../../model/transformation-validation';
import {SensorEnrichmentConfigService} from '../../service/sensor-enrichment-config.service';
import {SensorEnrichmentConfig} from '../../model/sensor-enrichment-config';
import {SensorFieldSchemaComponent} from '../sensor-field-schema/sensor-field-schema.component';
import {SensorStellarComponent} from '../sensor-stellar/sensor-stellar.component';
import {HttpUtil} from '../../util/httpUtil';
import {KafkaService} from '../../service/kafka.service';
import {SensorGrokComponent} from '../sensor-grok/sensor-grok.component';

export enum Pane {
  GROK, STELLAR, FIELDSCHEMA
}

export enum KafkaStatus {
  NO_TOPIC, NOT_EMITTING, EMITTING
}

@Component({
  selector: 'metron-config-sensor',
  templateUrl: 'sensor-parser-config.component.html',
  styleUrls: ['sensor-parser-config.component.scss']
})

export class SensorParserConfigComponent implements OnInit {

  sensorConfigForm: FormGroup;
  transformsValidationForm: FormGroup;

  sensorParserConfig: SensorParserConfig = new SensorParserConfig();
  sensorEnrichmentConfig: SensorEnrichmentConfig = new SensorEnrichmentConfig();

  showGrokValidator: boolean = false;
  showTransformsValidator: boolean = false;
  showAdvancedParserConfiguration: boolean = false;
  showStellar: boolean = false;
  showFieldSchema: boolean = false;

  availableParsers = {};
  availableParserNames = [];

  editMode: boolean = false;

  topicExists: boolean = false;

  transformsValidationResult: {map: any, keys: string[]} = {map: {}, keys: []};
  transformsValidation: TransformationValidation = new TransformationValidation();

  pane = Pane;
  openPane: Pane = null;

  kafkaStatus = KafkaStatus;
  currentKafkaStatus = null;

  disableTransformsConfig: boolean = true;

  @ViewChild(SensorGrokComponent) sensorGrokComponent: SensorGrokComponent;
  @ViewChild(SensorFieldSchemaComponent) sensorFieldSchema: SensorFieldSchemaComponent;
  @ViewChild(SensorStellarComponent) sensorStellar: SensorStellarComponent;

  constructor(private sensorParserConfigService: SensorParserConfigService, private metronAlerts: MetronAlerts,
              private sensorEnrichmentConfigService: SensorEnrichmentConfigService, private route: ActivatedRoute,
              private router: Router, private kafkaService: KafkaService) {
    this.sensorParserConfig.parserConfig = {};
  }


  init(id: string): void {
    if (id !== 'new') {
      this.editMode = true;

      this.sensorParserConfigService.get(id).subscribe((results: SensorParserConfig) => {
        this.sensorParserConfig = results;
        this.getKafkaStatus();
        this.canConfigureTransformConfig();
        if (Object.keys(this.sensorParserConfig.parserConfig).length > 0) {
          this.showAdvancedParserConfiguration = true;
        }
        });

      this.sensorEnrichmentConfigService.get(id).subscribe((result: SensorEnrichmentConfig) => {
        this.sensorEnrichmentConfig = result;
      },
      error => {
        this.sensorEnrichmentConfig = new SensorEnrichmentConfig();
        this.sensorEnrichmentConfig.index = id;
      });

    } else {
      this.sensorParserConfig = new SensorParserConfig();
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.init(id);
    });
    this.createForms();
    this.getAvailableParsers();
  }

  createSensorConfig(): FormGroup {
    let group: any = {};

    group['sensorTopic'] = new FormControl(this.sensorParserConfig.sensorTopic, Validators.required);
    group['parserClassName'] = new FormControl(this.sensorParserConfig.parserClassName, Validators.required);
    group['grokStatement'] = new FormControl(this.sensorParserConfig.parserConfig['grokStatement']);
    group['transforms'] = new FormControl(this.sensorParserConfig['transforms']);
    group['stellar'] = new FormControl(this.sensorParserConfig);
    group['index'] = new FormControl(this.sensorEnrichmentConfig.index, Validators.required);
    group['batchSize'] = new FormControl(this.sensorEnrichmentConfig.batchSize, Validators.required);

    return new FormGroup(group);
  }

  createTransformsValidationForm(): FormGroup {
    let group: any = {};

    group['sampleData'] = new FormControl(this.transformsValidation.sampleData, Validators.required);
    group['sensorParserConfig'] = new FormControl(this.transformsValidation.sensorParserConfig, Validators.required);

    return new FormGroup(group);
  }

  createForms() {
    this.sensorConfigForm = this.createSensorConfig();
    this.transformsValidationForm = this.createTransformsValidationForm();
    if (Object.keys(this.sensorParserConfig.parserConfig).length > 0) {
      this.showAdvancedParserConfiguration = true;
    }
  }

  private getAvailableParsers() {
    this.sensorParserConfigService.getAvailableParsers().subscribe(
      availableParsers => {
        this.availableParsers = availableParsers;
        this.availableParserNames = Object.keys(availableParsers);
      }
    );
  }

  private getMessagePrefix(): string {
    return this.editMode ? 'Modified' : 'Created';
  }

  onSetSensorName(): void {
    if (!this.sensorEnrichmentConfig.index) {
      this.sensorEnrichmentConfig.index = this.sensorParserConfig.sensorTopic;
    }
    this.getKafkaStatus();
    this.canConfigureTransformConfig();
  }

  getKafkaStatus() {
    if (!this.sensorParserConfig.sensorTopic || this.sensorParserConfig.sensorTopic.length === 0) {
      this.currentKafkaStatus = null;
      return;
    }

    this.kafkaService.get(this.sensorParserConfig.sensorTopic).subscribe(kafkaTopic => {
      this.kafkaService.sample(this.sensorParserConfig.sensorTopic).subscribe((sampleData: string) => {
          this.currentKafkaStatus = (sampleData && sampleData.length > 0) ? KafkaStatus.EMITTING : KafkaStatus.NOT_EMITTING;
        }, error => {
            this.currentKafkaStatus = KafkaStatus.NOT_EMITTING;
          });
        },
        error => {
          this.currentKafkaStatus = KafkaStatus.NO_TOPIC;
        });

  }

  getTransforms(): string {
    let count = 0;
    if (this.sensorParserConfig.fieldTransformations) {
      for (let tranforms of this.sensorParserConfig.fieldTransformations) {
        if (tranforms.output) {
          count += tranforms.output.length;
        }
      }
    }

    return count + ' Transformations Applied';
  }

  goBack() {
    this.router.navigateByUrl('/sensors');
  }

  saveOpenPanes() {
    if (this.showGrokValidator) {
      this.sensorGrokComponent.onSaveGrok();
    }

    if (this.showFieldSchema) {
      this.sensorFieldSchema.onSave();
    }

    if (this.showStellar) {
      this.sensorStellar.onSave();
    }
  }

  onSave() {
    this.saveOpenPanes();

    let sensorParserConfigSave: SensorParserConfig = new SensorParserConfig();
    sensorParserConfigSave.parserConfig = {};
    sensorParserConfigSave.sensorTopic = this.sensorParserConfig.sensorTopic;
    sensorParserConfigSave.parserClassName = this.sensorParserConfig.parserClassName;
    sensorParserConfigSave.parserConfig = this.sensorParserConfig.parserConfig;
    sensorParserConfigSave.fieldTransformations = this.sensorParserConfig.fieldTransformations;

    this.sensorParserConfigService.post(sensorParserConfigSave).subscribe(
      sensorParserConfig => {
        this.sensorEnrichmentConfigService.post(sensorParserConfig.sensorTopic, this.sensorEnrichmentConfig).subscribe(
            (sensorEnrichmentConfig: SensorEnrichmentConfig) => {
              this.metronAlerts.showSuccessMessage(this.getMessagePrefix() + ' Sensor ' + sensorParserConfig.sensorTopic);
              this.sensorParserConfigService.dataChangedSource.next([sensorParserConfigSave]);
              this.goBack();
        },
        error => {
            let msg = ' Sensor parser config but unable to save enrichment configuration: ';
            this.metronAlerts.showErrorMessage(this.getMessagePrefix() + msg + HttpUtil.getErrorMessageFromBody(error));
        });
      },
      error => {
        this.metronAlerts.showErrorMessage(this.getMessagePrefix() + ' Sensor parser config: ' + HttpUtil.getErrorMessageFromBody(error));
      });
  }

  isGrokParser(): boolean {
    return this.sensorParserConfig.parserClassName === 'org.apache.metron.parsers.GrokParser';
  }

  getTransformationCount(): number {
    let stellarTransformations = this.sensorParserConfig.fieldTransformations.filter(fieldTransformer =>
      fieldTransformer.transformation === 'STELLAR');
    if (stellarTransformations.length > 0 && stellarTransformations[0].config) {
      return Object.keys(stellarTransformations[0].config).length;
    } else {
      return 0;
    }
  }

  getEnrichmentCount(): number {
    let count = 0;
    if (this.sensorEnrichmentConfig.enrichment.fieldMap) {
      for (let enrichment in this.sensorEnrichmentConfig.enrichment.fieldMap) {
        if (enrichment !== 'hbaseEnrichment' && enrichment !== 'stellar') {
          count += this.sensorEnrichmentConfig.enrichment.fieldMap[enrichment].length;
        }
      }
    }
    if (this.sensorEnrichmentConfig.enrichment.fieldToTypeMap) {
      for (let fieldName in this.sensorEnrichmentConfig.enrichment.fieldToTypeMap) {
        if (this.sensorEnrichmentConfig.enrichment.fieldToTypeMap.hasOwnProperty(fieldName)) {
          count += this.sensorEnrichmentConfig.enrichment.fieldToTypeMap[fieldName].length;
        }
      }
    }
    return count;
  }

  getThreatIntelCount(): number {
    let count = 0;
    if (this.sensorEnrichmentConfig.threatIntel.fieldToTypeMap) {
      for (let fieldName in this.sensorEnrichmentConfig.threatIntel.fieldToTypeMap) {
        if (this.sensorEnrichmentConfig.threatIntel.fieldToTypeMap.hasOwnProperty(fieldName)) {
          count += this.sensorEnrichmentConfig.threatIntel.fieldToTypeMap[fieldName].length;
        }
      }
    }
    return count;
  }

  showPane(pane: Pane) {
    this.setPaneVisibility(pane, true);
  }

  hideGrokPaneUpdateDisableTransformsConfig() {
    this.hidePane(Pane.GROK);
    this.canConfigureTransformConfig();
  }

  hidePane(pane: Pane) {
    this.setPaneVisibility(pane, false);
  }

  setPaneVisibility(pane: Pane, visibilty: boolean) {
      this.showGrokValidator = (pane === Pane.GROK) ? visibilty : false;
      this.showFieldSchema = (pane === Pane.FIELDSCHEMA) ? visibilty : false;
      this.showStellar = (pane ===  Pane.STELLAR) ? visibilty : false;
  }

  onFieldSchemaChanged(): void {
    this.sensorStellar.init();
  }

  onStellarChanged(): void {
    this.sensorFieldSchema.createFieldSchemaRows();
  }

  onAdvancedConfigFormClose(): void {
    this.showAdvancedParserConfiguration = false;
  }

  validParserConfig(): boolean {
    if (this.isGrokParser()) {
      return (this.sensorParserConfig.parserConfig['grokStatement'] !== undefined &&
              this.sensorParserConfig.parserConfig['grokStatement'].length > 0);
    }

    return (this.sensorParserConfig.parserClassName !== undefined && this.sensorParserConfig.parserClassName.length > 0);
  }

  canConfigureTransformConfig() {
    this.disableTransformsConfig = !((this.sensorParserConfig.sensorTopic !== undefined &&
                                      this.sensorParserConfig.sensorTopic.length > 0) &&
                                        this.validParserConfig());
  }
}
