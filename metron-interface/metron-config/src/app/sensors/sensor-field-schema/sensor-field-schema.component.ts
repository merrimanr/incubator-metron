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
/* tslint:disable:max-line-length */
import { Component, OnInit, Input, OnChanges, ViewChild, SimpleChanges, Output, EventEmitter } from '@angular/core';
import {SensorParserConfig} from '../../model/sensor-parser-config';
import {ParseMessageRequest} from '../../model/parse-message-request';
import {SensorParserConfigService} from '../../service/sensor-parser-config.service';
import {TransformationValidationService} from '../../service/transformation-validation.service';
import {AutocompleteOption} from '../../model/autocomplete-option';
import {StellarFunctionDescription} from '../../model/stellar-function-description';
import {SensorEnrichmentConfig, EnrichmentConfig, ThreatIntelConfig} from '../../model/sensor-enrichment-config';
import {FieldTransformer} from '../../model/field-transformer';
import {SampleDataComponent} from '../../shared/sample-data/sample-data.component';
import {MetronAlerts} from '../../shared/metron-alerts';
import {SensorEnrichmentConfigService} from '../../service/sensor-enrichment-config.service';
import {TransformationValidation} from "../../model/transformation-validation";

export class FieldSchemaRow {
  inputFieldName: string;
  outputFieldName: string;
  preview: string;
  value: string;
  showConfig: boolean;
  showBlocklyEditor: boolean;
  isRemoved: boolean;
  isSimple: boolean;
  isNew: boolean;
  isParserGenerated: boolean;
  conditionalRemove: boolean;
  transformConfigured: AutocompleteOption[] = [];
  enrichmentConfigured: AutocompleteOption[] = [];
  threatIntelConfigured: AutocompleteOption[] = [];

  constructor(fieldName: string) {
    this.inputFieldName = fieldName;
    this.outputFieldName = fieldName;
    this.conditionalRemove = false;
    this.isParserGenerated = false;
    this.showConfig = false;
    this.showBlocklyEditor = false;
    this.isSimple = true;
    this.isRemoved = false;
    this.preview = fieldName;
  }
}

@Component({
  selector: 'metron-config-sensor-field-schema',
  templateUrl: './sensor-field-schema.component.html',
  styleUrls: ['./sensor-field-schema.component.scss']
})
export class SensorFieldSchemaComponent implements OnInit, OnChanges {

  @Input() sensorParserConfig: SensorParserConfig;
  @Input() sensorEnrichmentConfig: SensorEnrichmentConfig;
  @Input() showFieldSchema; boolean;

  parsedMessage: any = {};
  parsedFields: string[];
  transformedMessage = {};
  fieldSchemaRows: FieldSchemaRow[] = [];
  savedFieldSchemaRows: FieldSchemaRow[] = [];

  transformOptions: AutocompleteOption[] = [];
  enrichmentOptions: AutocompleteOption[] = [];
  threatIntelOptions: AutocompleteOption[] = [];

  transformFunctions: StellarFunctionDescription[];

  @ViewChild(SampleDataComponent) sampleData: SampleDataComponent;
  @Output() hideFieldSchema: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onFieldSchemaChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  sampleThreatIntels: string[] = ['malicious_ip'];

  constructor(private sensorParserConfigService: SensorParserConfigService,
              private transformationValidationService: TransformationValidationService,
              private sensorEnrichmentConfigService: SensorEnrichmentConfigService,
              private metronAlerts: MetronAlerts) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showFieldSchema'] && changes['showFieldSchema'].currentValue) {
      this.sampleData.getNextSample();
    }
  }

  ngOnInit() {
    this.getTransformFunctions();
    this.getEnrichmentFunctions();
    this.getThreatIntelfunctions();
  }

  getTransformFunctions() {
    this.transformOptions = [];

    this.transformationValidationService.listSimpleFunctions().subscribe((result: StellarFunctionDescription[]) => {
      this.transformFunctions = result;
      for (let fun of result) {
        this.transformOptions.push(new AutocompleteOption(fun.name, fun.name, fun.description));
      }
    });
  }

  getEnrichmentFunctions() {
    this.enrichmentOptions = [];

    this.sensorEnrichmentConfigService.getAvailable().subscribe((result: string[]) => {
      for (let fun of result) {
        this.enrichmentOptions.push(new AutocompleteOption(fun));
      }
    });
  }

  getThreatIntelfunctions() {
    this.threatIntelOptions = [];
    for (let threatName of this.sampleThreatIntels) {
      this.threatIntelOptions.push(new AutocompleteOption(threatName));
    }

  }

  isSimpleFunction(inputFieldName: string, configuredFunctions: string[]) {
    let operators = ['==', '!=', '&&', '||'];
    if (operators.filter(operator => inputFieldName.includes(operator)).length > 0) {
      return false;
    }
    for (let configuredFunction of configuredFunctions) {
      if (this.transformFunctions.filter(stellarFunctionDescription => stellarFunctionDescription.name === configuredFunction).length === 0) {
        return false;
      }
    }
    return true;
  }

  isSimpleRemoveTransform(fieldTransformer: FieldTransformer): boolean {
    if (fieldTransformer && fieldTransformer.transformation === 'REMOVE' &&
        fieldTransformer.config && Object.keys(fieldTransformer.config).length > 0) {
      return false;
    }

    return true;
  }

  createFieldSchemaRows() {
    this.fieldSchemaRows = [];
    this.savedFieldSchemaRows = [];
    let fieldSchemaRowsCreated = {};
    //let parsedFields = Object.keys(this.parserResult);

    // Update rows with Stellar transformations
    let stellarTransformations = this.sensorParserConfig.fieldTransformations.filter(fieldTransformer => fieldTransformer.transformation === 'STELLAR');
    for (let fieldTransformer of stellarTransformations) {
      if (fieldTransformer.config) {
        for (let outputFieldName of Object.keys(fieldTransformer.config)) {
          let stellarFunctionStatement = fieldTransformer.config[outputFieldName];
          let configuredFunctions = stellarFunctionStatement.split('(');
          let inputFieldName = configuredFunctions.splice(-1, 1)[0].replace(new RegExp('\\)', 'g'), '');
          configuredFunctions.reverse();
          if (!fieldSchemaRowsCreated[inputFieldName]) {
            fieldSchemaRowsCreated[inputFieldName] = new FieldSchemaRow(inputFieldName);
          }
          fieldSchemaRowsCreated[inputFieldName].outputFieldName = outputFieldName;
          fieldSchemaRowsCreated[inputFieldName].preview = stellarFunctionStatement;
          fieldSchemaRowsCreated[inputFieldName].isSimple = this.isSimpleFunction(inputFieldName, configuredFunctions);
          if (fieldSchemaRowsCreated[inputFieldName].isSimple) {
            for (let configuredFunction of configuredFunctions) {
              fieldSchemaRowsCreated[inputFieldName].transformConfigured.push(new AutocompleteOption(configuredFunction));
            }
          }
          fieldSchemaRowsCreated[inputFieldName].isParserGenerated = this.parsedFields.indexOf(outputFieldName) !== -1;
        }
      }
    }

    // Update rows with Remove Transformations
    let removeTransformations = this.sensorParserConfig.fieldTransformations.filter(fieldTransformer => fieldTransformer.transformation === 'REMOVE');
    for (let fieldTransformer of removeTransformations) {
      if (this.isSimpleRemoveTransform(fieldTransformer)) {
        for (let inputFieldName of fieldTransformer.input) {
          if (!fieldSchemaRowsCreated[inputFieldName]) {
            fieldSchemaRowsCreated[inputFieldName] = new FieldSchemaRow(inputFieldName);
          }
          fieldSchemaRowsCreated[inputFieldName].isRemoved = true;
        }
      } else {
        let fieldName = fieldTransformer.input[0];
        if (!fieldSchemaRowsCreated[fieldName]) {
          fieldSchemaRowsCreated[fieldName] = new FieldSchemaRow(fieldName);
        }

        fieldSchemaRowsCreated[fieldName].isRemoved = true;
        fieldSchemaRowsCreated[fieldName].conditionalRemove = true;
        fieldSchemaRowsCreated[fieldName].isParserGenerated = this.parsedFields.indexOf(fieldName) !== -1;
      }
    }

    // Update rows with enrichments
    if (this.sensorEnrichmentConfig.enrichment.fieldMap) {
      for (let enrichment in this.sensorEnrichmentConfig.enrichment.fieldMap) {
        if (enrichment !== 'hbaseEnrichment' && enrichment !== 'stellar') {
          let fieldNames = this.sensorEnrichmentConfig.enrichment.fieldMap[enrichment];
          for (let fieldName of fieldNames) {
            if (!fieldSchemaRowsCreated[fieldName]) {
              fieldSchemaRowsCreated[fieldName] = new FieldSchemaRow(fieldName);
            }
            fieldSchemaRowsCreated[fieldName].enrichmentConfigured.push(new AutocompleteOption(enrichment));
            fieldSchemaRowsCreated[fieldName].isParserGenerated = this.parsedFields.indexOf(fieldName) !== -1;
          }
        }
      }
    }

    // Update rows with HBase enrichments
    if (this.sensorEnrichmentConfig.enrichment.fieldToTypeMap) {
      for (let fieldName of Object.keys(this.sensorEnrichmentConfig.enrichment.fieldToTypeMap)) {
        let enrichments = this.sensorEnrichmentConfig.enrichment.fieldToTypeMap[fieldName];
        if (!fieldSchemaRowsCreated[fieldName]) {
          fieldSchemaRowsCreated[fieldName] = new FieldSchemaRow(fieldName);
        }
        for (let enrichment of enrichments) {
          fieldSchemaRowsCreated[fieldName].enrichmentConfigured.push(new AutocompleteOption(enrichment));
        }
        fieldSchemaRowsCreated[fieldName].isParserGenerated = this.parsedFields.indexOf(fieldName) !== -1;
      }
    }

    // Update rows with threatIntels
    if (this.sensorEnrichmentConfig.threatIntel.fieldToTypeMap) {
      for (let fieldName of  Object.keys(this.sensorEnrichmentConfig.threatIntel.fieldToTypeMap)) {
        let threatIntels = this.sensorEnrichmentConfig.threatIntel.fieldToTypeMap[fieldName];

        if (!fieldSchemaRowsCreated[fieldName]) {
          fieldSchemaRowsCreated[fieldName] = new FieldSchemaRow(fieldName);
        }

        for (let threatIntel of threatIntels) {
          fieldSchemaRowsCreated[fieldName].threatIntelConfigured.push(new AutocompleteOption(threatIntel));
        }
        fieldSchemaRowsCreated[fieldName].isParserGenerated = this.parsedFields.indexOf(fieldName) !== -1;
      }
    }

    this.fieldSchemaRows = Object.keys(fieldSchemaRowsCreated).map(key => fieldSchemaRowsCreated[key]);

    // Adds rows from parseResult with no transformations/enrichments/threatIntels
    let fieldSchemaRowsCreatedKeys = Object.keys(fieldSchemaRowsCreated);
    for (let fieldName of this.parsedFields.filter(fieldName => fieldSchemaRowsCreatedKeys.indexOf(fieldName) === -1)) {
        let field = new FieldSchemaRow(fieldName);
        field.isParserGenerated = true;
        this.fieldSchemaRows.push(field);
    }

    // save the initial fieldSchemaRows
    for (let fieldSchemaRow of this.fieldSchemaRows) {
      this.savedFieldSchemaRows.push(JSON.parse(JSON.stringify(fieldSchemaRow)));
    }
  }

  getChanges(fieldSchemaRow: FieldSchemaRow): string {

    if (fieldSchemaRow.isRemoved) {
      return 'Disabled';
    }

    let transformFunction = fieldSchemaRow.inputFieldName !== fieldSchemaRow.outputFieldName ? fieldSchemaRow.preview : '';
    let enrichments = fieldSchemaRow.enrichmentConfigured.map(autocomplete => autocomplete.name).join(', ');
    let threatIntel = fieldSchemaRow.threatIntelConfigured.map(autocomplete => autocomplete.name).join(', ');

    transformFunction = transformFunction.length > 30 ? (transformFunction.substring(0, 25) + '...') : transformFunction;

    let displayString = transformFunction.length > 0 ? ('Transforms: ' + transformFunction) : '';
    displayString += (transformFunction.length > 0 ? ' <br> ' : '') + (enrichments.length > 0 ? ('Enrichments: ' + enrichments) : '');
    displayString += (enrichments.length > 0 ? ' <br> ' : '') + (threatIntel.length > 0 ? ('Threat Intel: ' + threatIntel) : '');

    return displayString;
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
        parsedMessage => {
          this.parsedMessage = parsedMessage;
          this.parsedFields = Object.keys(parsedMessage);
          this.createFieldSchemaRows();
          this.transformMessage();
        },
        error => {
          this.onSampleDataNotAvailable();
        });
  }

  onSampleDataNotAvailable() {
    this.createFieldSchemaRows();
  }

  onDelete(fieldSchemaRow: FieldSchemaRow) {
    this.fieldSchemaRows.splice(this.fieldSchemaRows.indexOf(fieldSchemaRow), 1);
    this.savedFieldSchemaRows.splice(this.fieldSchemaRows.indexOf(fieldSchemaRow), 1);
  }

  onRemove(fieldSchemaRow: FieldSchemaRow) {
    fieldSchemaRow.isRemoved = true;
    this.onSaveChange(fieldSchemaRow);
  }

  onEnable(fieldSchemaRow: FieldSchemaRow) {
    if (fieldSchemaRow.conditionalRemove) {
      this.metronAlerts.showErrorMessage('Unable to enable field. The remove operation has a stellar condition please enable the field from stellar configuration pane.');
      return;
    }
    fieldSchemaRow.isRemoved = false;
    this.onSaveChange(fieldSchemaRow);
  }

  onSaveChange(savedFieldSchemaRow: FieldSchemaRow) {
    savedFieldSchemaRow.showConfig = false;
    savedFieldSchemaRow.isNew = false;
    let fieldSchemaRow = JSON.parse(JSON.stringify(savedFieldSchemaRow));
    let initialSchemaRow = this.savedFieldSchemaRows.filter(fieldSchemaRow => fieldSchemaRow.outputFieldName === savedFieldSchemaRow.outputFieldName)[0];
    if (initialSchemaRow) {
      Object.assign(initialSchemaRow, fieldSchemaRow);
    } else {
      this.savedFieldSchemaRows.push(fieldSchemaRow);
    }
    this.onSave();
    this.transformMessage();
  }

  onCancelChange(cancelledFieldSchemaRow: FieldSchemaRow) {
    cancelledFieldSchemaRow.showConfig = false;
    let initialSchemaRow = this.savedFieldSchemaRows.filter(fieldSchemaRow => fieldSchemaRow.inputFieldName === cancelledFieldSchemaRow.inputFieldName)[0];
    Object.assign(cancelledFieldSchemaRow, JSON.parse(JSON.stringify(initialSchemaRow)));
  }

  onCancel(): void {
    this.hideFieldSchema.emit(true);
  }

  createTransformFunction(fieldSchemaRow: FieldSchemaRow): string {
    let func = fieldSchemaRow.inputFieldName;

    for (let config of fieldSchemaRow.transformConfigured) {
      func = config.name + '(' + func + ')';
    }

    return func;
  }

  onTransformsChange(fieldSchemaRow: FieldSchemaRow): void {
    fieldSchemaRow.preview = fieldSchemaRow.transformConfigured.length === 0 ? '' : this.createTransformFunction(fieldSchemaRow);
  }

  addNewRule() {
    let fieldSchemaRow = new FieldSchemaRow('new');
    fieldSchemaRow.isNew = true;
    fieldSchemaRow.showConfig = true;
    fieldSchemaRow.inputFieldName = '';
    this.fieldSchemaRows.push(fieldSchemaRow);
  }

  onSave() {
    let removeTransformations: string[] = [];

    // Remove all STELLAR functions and retain only the REMOVE objects
    this.sensorParserConfig.fieldTransformations = this.sensorParserConfig.fieldTransformations.filter(fieldTransformer => {
      if (!this.isSimpleRemoveTransform(fieldTransformer)) {
        return true;
      }
      return false;
    });

    let transformConfigObject = new FieldTransformer();
    transformConfigObject.output = [];
    transformConfigObject.config = {};
    transformConfigObject.transformation = 'STELLAR';

    let enrichmentConfigObject = new EnrichmentConfig();
    enrichmentConfigObject.config = {};
    let threatIntelConfigObject = new ThreatIntelConfig();
    threatIntelConfigObject.triageConfig = this.sensorEnrichmentConfig.threatIntel.triageConfig;


    for (let fieldSchemaRow of this.savedFieldSchemaRows) {
      if (fieldSchemaRow.preview.length > 0 && fieldSchemaRow.inputFieldName !== fieldSchemaRow.outputFieldName) {
        transformConfigObject.output.push(fieldSchemaRow.outputFieldName);
        transformConfigObject.config[fieldSchemaRow.outputFieldName] = fieldSchemaRow.preview;
      }
      if (fieldSchemaRow.isRemoved && !fieldSchemaRow.conditionalRemove) {
        removeTransformations.push(fieldSchemaRow.inputFieldName);
      }
      if (fieldSchemaRow.enrichmentConfigured.length > 0) {
        for (let option of fieldSchemaRow.enrichmentConfigured) {
          if (option.name === 'geo' || option.name === 'host') {
            if (!enrichmentConfigObject.fieldMap[option.name]) {
              enrichmentConfigObject.fieldMap[option.name] = [];
            }
            enrichmentConfigObject.fieldMap[option.name].push(fieldSchemaRow.inputFieldName);
          } else {
            if (!enrichmentConfigObject.fieldMap['hbaseEnrichment']) {
              enrichmentConfigObject.fieldMap['hbaseEnrichment'] = [];
            }
            enrichmentConfigObject.fieldMap['hbaseEnrichment'].push(fieldSchemaRow.inputFieldName);
            if (!enrichmentConfigObject.fieldToTypeMap[fieldSchemaRow.inputFieldName]) {
              enrichmentConfigObject.fieldToTypeMap[fieldSchemaRow.inputFieldName] = [];
            }
            enrichmentConfigObject.fieldToTypeMap[fieldSchemaRow.inputFieldName].push(option.name);
          }
        }
      }
      if (fieldSchemaRow.threatIntelConfigured.length > 0) {
        for (let option of fieldSchemaRow.threatIntelConfigured) {
          if (!threatIntelConfigObject.fieldMap['hbaseThreatIntel']) {
            threatIntelConfigObject.fieldMap['hbaseThreatIntel'] = [];
          }
          threatIntelConfigObject.fieldMap['hbaseThreatIntel'].push(fieldSchemaRow.inputFieldName);
          if (!threatIntelConfigObject.fieldToTypeMap[fieldSchemaRow.inputFieldName]) {
            threatIntelConfigObject.fieldToTypeMap[fieldSchemaRow.inputFieldName] = [];
          }
          threatIntelConfigObject.fieldToTypeMap[fieldSchemaRow.inputFieldName].push(option.name);
        }
      }
    }

    if (Object.keys(transformConfigObject.config).length > 0) {
      this.sensorParserConfig.fieldTransformations.push(transformConfigObject);
    }

    if (removeTransformations.length > 0) {
      let removeConfigObject = new FieldTransformer();
      removeConfigObject.transformation = 'REMOVE';
      removeConfigObject.input = removeTransformations;
      this.sensorParserConfig.fieldTransformations.push(removeConfigObject);
    }

    this.sensorEnrichmentConfig.enrichment = enrichmentConfigObject;
    this.sensorEnrichmentConfig.threatIntel = threatIntelConfigObject;
  }

  onShowSimple(fieldSchemaRow: FieldSchemaRow) {
    fieldSchemaRow.showBlocklyEditor = false;
  }
  
  onShowBuilder(fieldSchemaRow: FieldSchemaRow) {
    fieldSchemaRow.showBlocklyEditor = true;
  }

  onCancelBlockly(fieldSchemaRow: FieldSchemaRow) {
    fieldSchemaRow.isSimple = true;
  }

  onStatementChange(statement: string, fieldSchemaRow: FieldSchemaRow) {
    fieldSchemaRow.preview = statement;
    let configuredFunctions = statement.split('(');
    let inputFieldName = configuredFunctions.splice(-1, 1)[0].replace(new RegExp('\\)', 'g'), '');
    fieldSchemaRow.isSimple = this.isSimpleFunction(inputFieldName, configuredFunctions);
    if (fieldSchemaRow.isSimple) {
      fieldSchemaRow.inputFieldName = inputFieldName;
      fieldSchemaRow.transformConfigured = [];
      for (let configuredFunction of configuredFunctions) {
        fieldSchemaRow.transformConfigured.push(new AutocompleteOption(configuredFunction));
      }
    }
  }

  transformMessage() {
    let transformationValidation = new TransformationValidation();
    transformationValidation.sampleData = this.parsedMessage;
    transformationValidation.sensorParserConfig = this.sensorParserConfig;
    this.transformationValidationService.validate(transformationValidation).subscribe(transformedMessage => {
      //this.transformedMessage = transformedMessage;
      for (let fieldSchemaRow of this.fieldSchemaRows) {
        fieldSchemaRow.value = transformedMessage[fieldSchemaRow.outputFieldName];
      }
    });
  }
}
