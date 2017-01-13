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

declare var Blockly: any;

@Component({
  selector: 'metron-config-sensor-rule-blockly',
  templateUrl: './sensor-rule-blockly.component.html',
  styleUrls: ['./sensor-rule-blockly.component.scss']
})

export class SensorRuleBlocklyComponent implements OnInit, AfterViewInit {

  @Input() value: string;
  @Input() score: number;

  @Output() onCancelTextEditor: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onSubmitTextEditor: EventEmitter<{}> = new EventEmitter<{}>();

  xml: string = '<xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style="display: none;"><category name="List"><block type="stellar_in"></block><block type="lists_create_with"></block><block type="stellar_map_create"></block><block type="stellar_key_value"><value name="KEY"><block type="text"></value></block></category><category name="Stellar"><category name="MaaS"><block type="stellar_MAAS_MODEL_APPLY"></block><block type="stellar_MAAS_GET_ENDPOINT"></block></category><category name="DataStructure"><block type="stellar_BLOOM_MERGE"></block><block type="stellar_IS_EMPTY"></block><block type="stellar_LENGTH"></block><block type="stellar_BLOOM_EXISTS"></block><block type="stellar_BLOOM_INIT"></block><block type="stellar_BLOOM_ADD"></block></category><category name="SimpleHBaseEnrichment"><block type="stellar_ENRICHMENT_GET"></block><block type="stellar_ENRICHMENT_EXISTS"></block></category><category name="String"><block type="stellar_TRIM"></block><block type="stellar_JOIN"></block><block type="stellar_ENDS_WITH"></block><block type="stellar_GET_FIRST"></block><block type="stellar_TO_STRING"></block><block type="stellar_STARTS_WITH"></block><block type="stellar_GET"></block><block type="stellar_REGEXP_MATCH"></block><block type="stellar_TO_LOWER"></block><block type="stellar_GET_LAST"></block><block type="stellar_SPLIT"></block><block type="stellar_TO_UPPER"></block></category><category name="Math"><block type="stellar_ABS"></block></category><category name="Conversion"><block type="stellar_TO_INTEGER"></block><block type="stellar_TO_LONG"></block><block type="stellar_TO_DOUBLE"></block></category><category name="Date"><block type="stellar_MONTH"></block><block type="stellar_WEEK_OF_MONTH"></block><block type="stellar_YEAR"></block><block type="stellar_WEEK_OF_YEAR"></block><block type="stellar_DAY_OF_WEEK"></block><block type="stellar_DAY_OF_YEAR"></block><block type="stellar_DAY_OF_MONTH"></block><block type="stellar_TO_EPOCH_TIMESTAMP"></block></category><category name="System"><block type="stellar_SYSTEM_ENV_GET"></block><block type="stellar_SYSTEM_PROPERTY_GET"></block></category><category name="MedianAbsoluteDeviation"><block type="stellar_OUTLIER_MAD_SCORE"></block><block type="stellar_OUTLIER_MAD_STATE_MERGE"></block><block type="stellar_OUTLIER_MAD_ADD"></block></category><category name="StellarStatistics"><block type="stellar_STATS_MAX"></block><block type="stellar_STATS_KURTOSIS"></block><block type="stellar_STATS_SUM_SQUARES"></block><block type="stellar_STATS_INIT"></block><block type="stellar_STATS_SD"></block><block type="stellar_STATS_COUNT"></block><block type="stellar_STATS_SKEWNESS"></block><block type="stellar_STATS_POPULATION_VARIANCE"></block><block type="stellar_STATS_VARIANCE"></block><block type="stellar_STATS_ADD"></block><block type="stellar_STATS_QUADRATIC_MEAN"></block><block type="stellar_STATS_GEOMETRIC_MEAN"></block><block type="stellar_STATS_MIN"></block><block type="stellar_STATS_SUM_LOGS"></block><block type="stellar_STATS_SUM"></block><block type="stellar_STATS_MEAN"></block><block type="stellar_STATS_MERGE"></block><block type="stellar_STATS_PERCENTILE"></block></category><category name="Network"><block type="stellar_DOMAIN_TO_TLD"></block><block type="stellar_DOMAIN_REMOVE_SUBDOMAINS"></block><block type="stellar_DOMAIN_REMOVE_TLD"></block><block type="stellar_URL_TO_PORT"></block><block type="stellar_IN_SUBNET"></block><block type="stellar_URL_TO_PATH"></block><block type="stellar_URL_TO_PROTOCOL"></block><block type="stellar_URL_TO_HOST"></block></category><category name="SimpleFieldTransformation"><block type="stellar_PROTOCOL_TO_NAME"></block></category><category name="Map"><block type="stellar_MAP_GET"></block><block type="stellar_MAP_EXISTS"></block></category><category name="Integer"><block type="stellar_IS_INTEGER"></block></category><category name="Email"><block type="stellar_IS_EMAIL"></block></category><category name="IP"><block type="stellar_IS_IP"></block></category><category name="Domain"><block type="stellar_IS_DOMAIN"></block></category><category name="Date"><block type="stellar_IS_DATE"></block></category><category name="URL"><block type="stellar_IS_URL"></block></category></category><category name="Boolean"><block type="logic_compare"></block> <block type="logic_operation"></block> <block type="logic_negate"></block> <block type="logic_boolean"></block> <block type="logic_null"></block> <block type="logic_ternary"></block></block></category><category name="Math"><block type="stellar_arithmetic"></block></category><category name="Fields"><block type="available_fields"></block></category><category name="Constants"><block type="text"><field name="TEXT"></field></block><block type="logic_boolean"><field name="BOOL">TRUE</field></block><block type="math_number"></block></category></xml>';
  @ViewChild('xmltemplate') xmltemplate: ElementRef;
  statement: string;
  workspace;

  constructor(private blocklyService: BlocklyService) { }

  ngOnInit() {
    // B'coz of https://github.com/google/blockly/issues/299
    this.statement = this.value;
    Blockly.WorkspaceSvg.prototype.preloadAudio_ = function() {};
  }

  savedWorkspace: string = '<xml><block type="logic_operation" x="20" y="20"><field name="OP">AND</field><value name="A"><block type="stellar_IS_DOMAIN"><value name="ADDRESS"><block type="stellar_IS_IP"><value name="IP"><block type="available_fields"><field name="FIELD_NAME">ip_src_addr</field></block></value></block></value></block></value><value name="B"><block type="stellar_IS_EMAIL"><value name="ADDRESS"><block type="available_fields"><field name="FIELD_NAME">sensor_type</field></block></value></block></value></block></xml>';

  ngAfterViewInit() {
    this.addAvailableFieldsBlock(this.availableFields);
    this.injectBlockly();
  }

  injectBlockly() {
    this.xmltemplate.nativeElement.outerHTML = this.xml;
    this.workspace = Blockly.inject('blocklyDiv',
        {media: 'assets/blockly/media/',
          css: false,
          grid:
          {spacing: 15,
            length: 15,
            colour: '#4d4d4d',
            snap: true},
          toolbox: document.getElementById('toolbox')});

    this.workspace.addChangeListener(event => {
      this.statement = Blockly.JavaScript.workspaceToCode(this.workspace).replace(';', '');
    });

    this.loadCurrentStatement();
  }
  
  initialXml = `<xml>
    <block type="stellar_in" x="10" y="10">
        <value name="INPUT">
            <block type="text" id="n|m?2?2g]uzflDdeqE0U">
                <field name="TEXT">test</field>
            </block>
        </value>
        <value name="LIST">
            <block type="lists_created_with">
                <mutation items="2"/>
                <value name="ADD0">
                    <block type="stellar_TO_LOWER">
                        <value name="INPUT">
                            <block type="text">
                                <field name="TEXT">CASEY</field>
                            </block>
                        </value>
                    </block>
                </value>
                <value name="ADD1">
                    <block type="text">
                        <field name="TEXT">david</field>
                    </block>
                </value>
            </block>
        </value>
    </block>
</xml>`;

  loadCurrentStatement() {
    // let dom = Blockly.Xml.textToDom(this.initialXml);
    // Blockly.Xml.domToWorkspace(dom, this.workspace);
    this.blocklyService.statementToXml(this.statement).subscribe(xml => {
      let dom = Blockly.Xml.textToDom(xml);
      Blockly.Xml.domToWorkspace(dom, this.workspace);
    });
  }
  
  availableFields = ["sensor_type","ip_src_addr","ip_dst_addr","isAlert","host","method","protocol","application","enrichments.hbaseEnrichment.url.whois.home_country"];

  addAvailableFieldsBlock(fields) {
    fields.sort();
    let fieldArray = [];
    for(let field of fields) {
      fieldArray.push([field, field]);
    }
    Blockly.Blocks['available_fields'] = {
      init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(fieldArray), "FIELD_NAME");
        this.setOutput(true, "String");
        this.setTooltip('These are the available fields');
        this.setHelpUrl('http://www.example.com/');
        this.setColour(270);
      }
    };
  }

  onSave(): void {
    let rule = {};
    rule[this.statement] = this.score;
    this.onSubmitTextEditor.emit(rule);
  }

  onCancel(): void {
    this.onCancelTextEditor.emit(true);
  }

  count = 0;

  onAdd(): void {
    this.count = this.count + 1;
    let fieldName = 'field' + this.count;
    this.availableFields.push(fieldName);
    this.addAvailableFieldsBlock(this.availableFields);
  }

  onRemove(): void {
    this.count = this.count - 1;
    this.availableFields.pop();
    this.addAvailableFieldsBlock(this.availableFields);
  }

  onPrint() {
    console.log(Blockly.Xml.workspaceToDom(this.workspace));
  }

}
