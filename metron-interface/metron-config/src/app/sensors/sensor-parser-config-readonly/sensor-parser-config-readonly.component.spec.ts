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
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Observable}     from 'rxjs/Observable';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Inject} from '@angular/core';
import {SensorParserConfigHistory} from '../../model/sensor-parser-config-history';
import {RequestOptions, Response, ResponseOptions, Http} from '@angular/http';
import {SensorParserConfigReadonlyComponent} from './sensor-parser-config-readonly.component';
import {SensorParserConfigService} from '../../service/sensor-parser-config.service';
import {KafkaService} from '../../service/kafka.service';
import {TopologyStatus} from '../../model/topology-status';
import {SensorParserConfig} from '../../model/sensor-parser-config';
import {KafkaTopic} from '../../model/kafka-topic';
import {AuthenticationService} from '../../service/authentication.service';
import {SensorParserConfigHistoryService} from '../../service/sensor-parser-config-history.service';
import {StormService} from '../../service/storm.service';
import {MetronAlerts} from '../../shared/metron-alerts';
import {FieldTransformer} from '../../model/field-transformer';
import {SensorParserConfigReadonlyModule} from './sensor-parser-config-readonly.module';
import {APP_CONFIG, METRON_REST_CONFIG} from '../../app.config';
import {IAppConfig} from '../../app.config.interface';
import {SensorEnrichmentConfigService} from '../../service/sensor-enrichment-config.service';
import {SensorEnrichmentConfig, EnrichmentConfig, ThreatIntelConfig} from '../../model/sensor-enrichment-config';

class MockRouter {

  navigateByUrl(url: string) {

  }

}

class MockActivatedRoute {
  private name: string;
  params: Observable<Params>;

  setNameForTest(name: string) {
    this.name = name;
    this.params = Observable.create(observer => {
      observer.next({id: this.name});
      observer.complete();
    });
  }
}

class MockAuthenticationService extends AuthenticationService {

  constructor(private http2: Http, private router2: Router, @Inject(APP_CONFIG) private config2: IAppConfig) {
    super(http2, router2, config2);
  }

  public getCurrentUser(options: RequestOptions): Observable<Response> {
    let responseOptions: ResponseOptions = new ResponseOptions();
    responseOptions.body = 'user';
    let response: Response = new Response(responseOptions);
    return Observable.create(observer => {
      observer.next(response);
      observer.complete();
    });
  };
}

class MockSensorParserConfigHistoryService extends SensorParserConfigHistoryService {

  private sensorParserConfigHistory: SensorParserConfigHistory;

  constructor(private http2: Http, @Inject(APP_CONFIG) private config2: IAppConfig) {
    super(http2, config2);
  }

  public setForTest(sensorParserConfigHistory: SensorParserConfigHistory) {
    this.sensorParserConfigHistory = sensorParserConfigHistory;
  }

  public get(name: string): Observable<SensorParserConfigHistory> {
    return Observable.create(observer => {
      observer.next(this.sensorParserConfigHistory);
      observer.complete();
    });
  }
}

class MockSensorParserConfigService extends SensorParserConfigService {

  constructor(private http2: Http, @Inject(APP_CONFIG) private config2: IAppConfig) {
    super(http2, config2);
  }

}

class MockStormService extends StormService {
  private topologyStatus: TopologyStatus;

  constructor(private http2: Http, @Inject(APP_CONFIG) private config2: IAppConfig) {
    super(http2, config2);
  }

  public setForTest(topologyStatus: TopologyStatus) {
    this.topologyStatus = topologyStatus;
  }

  public getStatus(name: string): Observable<TopologyStatus> {
    return Observable.create(observer => {
      observer.next(this.topologyStatus);
      observer.complete();
    });
  }
}

class MockKafkaService extends KafkaService {

  private kafkaTopic: KafkaTopic;

  constructor(private http2: Http, @Inject(APP_CONFIG) private config2: IAppConfig) {
    super(http2, config2);
  }

  public setForTest(kafkaTopic: KafkaTopic) {
    this.kafkaTopic = kafkaTopic;
  }

  public get(name: string): Observable<KafkaTopic> {
    return Observable.create(observer => {
      observer.next(this.kafkaTopic);
      observer.complete();
    });
  }

  public sample(name: string): Observable<string> {
    return Observable.create(observer => {
      observer.next(JSON.stringify({'data': 'data1', 'data2': 'data3'}));
      observer.complete();
    });
  }
}

class MockSensorEnrichmentConfigService {
  private sensorEnrichmentConfig: SensorEnrichmentConfig;

  setForTest(sensorEnrichmentConfig: SensorEnrichmentConfig) {
    this.sensorEnrichmentConfig = sensorEnrichmentConfig;
  }

  public get(name: string): Observable<SensorEnrichmentConfig> {
    return Observable.create(observer => {
      observer.next(this.sensorEnrichmentConfig);
      observer.complete();
    });
  }

  public getAvailable(): Observable<string[]> {
    return Observable.create((observer) => {
      observer.next(['geo', 'host', 'whois']);
      observer.complete();
    });
  }
}

describe('Component: SensorParserConfigReadonly', () => {

  let comp: SensorParserConfigReadonlyComponent;
  let fixture: ComponentFixture<SensorParserConfigReadonlyComponent>;
  let sensorParserConfigHistoryService: MockSensorParserConfigHistoryService;
  let sensorEnrichmentConfigService: MockSensorEnrichmentConfigService;
  let sensorParserConfigService: SensorParserConfigService;
  let kafkaService: MockKafkaService;
  let stormService: MockStormService;
  let alerts: MetronAlerts;
  let authenticationService: AuthenticationService;
  let router: MockRouter;
  let activatedRoute: MockActivatedRoute;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [SensorParserConfigReadonlyModule],
      providers: [
        {provide: Http},
        {provide: ActivatedRoute, useClass: MockActivatedRoute},
        {provide: AuthenticationService, useClass: MockAuthenticationService},
        {provide: SensorEnrichmentConfigService, useClass: MockSensorEnrichmentConfigService},
        {provide: SensorParserConfigHistoryService, useClass: MockSensorParserConfigHistoryService},
        {provide: SensorParserConfigService, useClass: MockSensorParserConfigService},
        {provide: StormService, useClass: MockStormService},
        {provide: KafkaService, useClass: MockKafkaService},
        {provide: Router, useClass: MockRouter},
        {provide: APP_CONFIG, useValue: METRON_REST_CONFIG},
        MetronAlerts
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SensorParserConfigReadonlyComponent);
        comp = fixture.componentInstance;
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        authenticationService = fixture.debugElement.injector.get(AuthenticationService);
        sensorParserConfigHistoryService = fixture.debugElement.injector.get(SensorParserConfigHistoryService);
        sensorEnrichmentConfigService = fixture.debugElement.injector.get(SensorEnrichmentConfigService);
        sensorParserConfigService = fixture.debugElement.injector.get(SensorParserConfigService);
        stormService = fixture.debugElement.injector.get(StormService);
        kafkaService = fixture.debugElement.injector.get(KafkaService);
        router = fixture.debugElement.injector.get(Router);
        alerts = fixture.debugElement.injector.get(MetronAlerts);
      });

  }));

  it('should create an instance', async(() => {
    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;
    expect(component).toBeDefined();
  }));

  it('should have metadata defined ', async(() => {
    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;
    expect(component.editViewMetaData.length).toEqual(24);
  }));

  it('should have sensorsService with parserName and grokPattern defined and kafkaService defined', async(() => {
    let sensorParserInfo = new SensorParserConfigHistory();
    let sensorParserConfig = new SensorParserConfig();
    let kafkaTopic = new KafkaTopic();
    let topologyStatus = new TopologyStatus();

    sensorParserConfig.sensorTopic = 'bro';
    sensorParserConfig.parserClassName = 'org.apache.metron.parsers.GrokParser';
    sensorParserConfig.parserConfig = {grokPattern: 'SQUID_DELIMITED squid grok statement'};
    sensorParserInfo.config = sensorParserConfig;

    kafkaTopic.name = 'bro';
    kafkaTopic.numPartitions = 1;
    kafkaTopic.replicationFactor = 1;

    topologyStatus.name = 'bro';
    topologyStatus.latency = '10.1';
    topologyStatus.throughput = '15.2';

    let broEnrichment = {
      'fieldMap': {
        'geo': ['ip_dst_addr'],
        'host': ['ip_dst_addr'],
        'whois': [],
        'stellar': {'config': {'group1': {}}}
      },
      'fieldToTypeMap': {}, 'config': {}
    };
    let broThreatIntel = {'threatIntel': {
      'fieldMap': { 'hbaseThreatIntel': ['ip_dst_addr'] },
      'fieldToTypeMap': { 'ip_dst_addr': ['malicious_ip'] }
    }
    };
    let broEnrichments = new SensorEnrichmentConfig();
    broEnrichments.enrichment = Object.assign(new EnrichmentConfig(),  broEnrichment);
    broEnrichments.threatIntel = Object.assign(new ThreatIntelConfig(), broThreatIntel);

    sensorEnrichmentConfigService.setForTest(broEnrichments);
    sensorParserConfigHistoryService.setForTest(sensorParserInfo);
    kafkaService.setForTest(kafkaTopic);
    stormService.setForTest(topologyStatus);

    activatedRoute.setNameForTest('bro');

    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;

    component.ngOnInit();
    expect(component.sensorParserConfigHistory).toEqual(Object.assign(new SensorParserConfigHistory(), sensorParserInfo));
    expect(component.kafkaTopic).toEqual(kafkaTopic);
    expect(component.sensorEnrichmentConfig).toEqual(broEnrichments);
  }));

  it('getSensorStatusService should initialise the state variable to appropriate values ', async(() => {
    let sensorParserStatus = new TopologyStatus();
    sensorParserStatus.name = 'bro';
    sensorParserStatus.latency = '10.1';
    sensorParserStatus.status = null;
    sensorParserStatus.throughput = '15.2';

    stormService.setForTest(sensorParserStatus);
    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;

    component.getSensorStatusService();
    expect(component.topologyStatus.status).toEqual('Stopped');
    expect(component.topologyStatus['sensorStatus']).toEqual('-');

    sensorParserStatus.status = 'ACTIVE';
    stormService.setForTest(sensorParserStatus);
    component.getSensorStatusService();
    expect(component.topologyStatus.status).toEqual('Running');
    expect(component.topologyStatus['sensorStatus']).toEqual('Enabled');

    sensorParserStatus.status = 'KILLED';
    stormService.setForTest(sensorParserStatus);
    component.getSensorStatusService();
    expect(component.topologyStatus.status).toEqual('Stopped');
    expect(component.topologyStatus['sensorStatus']).toEqual('-');

    sensorParserStatus.status = 'INACTIVE';
    stormService.setForTest(sensorParserStatus);
    component.getSensorStatusService();
    expect(component.topologyStatus.status).toEqual('Disabled');
    expect(component.topologyStatus['sensorStatus']).toEqual('Disabled');
  }));

  it('setGrokStatement should set the variables appropriately ', async(() => {
    let sensorParserInfo = new SensorParserConfigHistory();
    let sensorParserConfig = new SensorParserConfig();
    sensorParserConfig.parserConfig = {};

    sensorParserConfig.parserConfig['grokStatement'] = 'IPV6 ((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|' +
      '(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|' +
      '[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|' +
      '2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|' +
      '((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|' +
      '(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|' +
      '[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|' +
      '((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|' +
      '(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|' +
      '[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|' +
      '((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\n' +
      '      IPV4 (?<![0-9])(?:(?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})[.](?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})[.](?:25[0-5]|' +
      '2[0-4][0-9]|[0-1]?[0-9]{1,2})[.](?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2}))(?![0-9])\n    IP (?:%{IPV6:UNWANTED}|' +
      '%{IPV4:UNWANTED})\n\n    MESSAGE .*\n\n    WEBSPHERE %{LOGSTART:UNWANTED} %{LOGMIDDLE:UNWANTED} %{MESSAGE:message}';
    sensorParserInfo.config = sensorParserConfig;

    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;
    component.sensorParserConfigHistory = sensorParserInfo;
    component.setGrokStatement();

    expect(component.grokStatement).toEqual('IPV6 ((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|' +
        '(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|' +
        '[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|' +
        '2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|' +
        '((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|' +
        '(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|' +
        '[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|' +
        '((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|' +
        '(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|' +
        '[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|' +
        '((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\n' +
        '      IPV4 (?<![0-9])(?:(?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})[.](?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})[.](?:25[0-5]|' +
        '2[0-4][0-9]|[0-1]?[0-9]{1,2})[.](?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2}))(?![0-9])\n    IP (?:%{IPV6:UNWANTED}|' +
        '%{IPV4:UNWANTED})\n\n    MESSAGE .*\n\n    WEBSPHERE %{LOGSTART:UNWANTED} %{LOGMIDDLE:UNWANTED} %{MESSAGE:message}');
  }));

  it('setTransformsConfigKeys/getTransformsOutput should return the keys of the transforms config  ', async(() => {
    let sensorParserInfo = new SensorParserConfigHistory();
    let sensorParserConfig = new SensorParserConfig();
    let fieldTransformer1 = new FieldTransformer();
    let fieldTransformer2 = new FieldTransformer();

    fieldTransformer1.config = {'a': 'abc', 'x': 'xyz'};
    fieldTransformer1.output = ['a', 'b', 'c'];
    fieldTransformer2.config = {'x': 'klm', 'b': 'def'};
    fieldTransformer2.output = ['a', 'b', 'c'];
    sensorParserConfig.fieldTransformations = [fieldTransformer1, fieldTransformer2];
    sensorParserInfo.config = sensorParserConfig;

    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;

    component.setTransformsConfigKeys();
    let transformsOutput = component.getTransformsOutput();

    expect(component.transformsConfigKeys.length).toEqual(0);
    expect(component.transformsConfigKeys).toEqual([]);
    expect(component.transformsConfigMap).toEqual({});
    expect(transformsOutput).toEqual('-');

    component.sensorParserConfigHistory = sensorParserInfo;
    component.setTransformsConfigKeys();
    transformsOutput = component.getTransformsOutput();

    expect(component.transformsConfigKeys.length).toEqual(3);
    expect(component.transformsConfigKeys).toEqual(['a', 'b', 'x']);
    expect(component.transformsConfigMap).toEqual({'a': ['abc'], 'b': ['def'], 'x': ['xyz', 'klm']});
    expect(transformsOutput).toEqual('a, b, c');
  }));

  it('goBack should navigate to sensors page', async(() => {
    router.navigateByUrl = jasmine.createSpy('navigateByUrl');

    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;

    component.goBack();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/sensors');
  }));

  it('onEditSensor should navigate to sensor edit', async(() => {
    router.navigateByUrl = jasmine.createSpy('navigateByUrl');

    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;
    component.selectedSensorName = 'abc';

    component.onEditSensor();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/sensors(dialog:sensors-config/abc)');
  }));

  it('should set sensorEnrichmentConfig and aggregationConfigKeys to be initialised', async(() => {
    let threatIntel = {
      'fieldMap': {
        'hbaseThreatIntel': [ 'ip_dst_addr', 'ip_src_addr', 'action']
      },
      'fieldToTypeMap': {
        'ip_dst_addr': [ 'malicious_ip'], 'ip_src_addr': [ 'malicious_ip'], 'action': [ 'malicious_ip']
      },
      'config': {},
      'triageConfig': {
        'riskLevelRules': {
          'IN_SUBNET(ip_dst_addr, \'192.168.0.0/24\')': 3,
          'user.type in [ \'admin\', \'power\' ] and asset.type == \'web\'': 3
        },
        'aggregator': 'MAX',
        'aggregationConfig': {}
      }
    };
    let expected = ['IN_SUBNET(ip_dst_addr, \'192.168.0.0/24\')', 'user.type in [ \'admin\', \'power\' ] and asset.type == \'web\''];

    let sensorEnrichmentConfig = new SensorEnrichmentConfig();
    sensorEnrichmentConfig.threatIntel = Object.assign(new ThreatIntelConfig(), threatIntel);
    sensorEnrichmentConfigService.setForTest(sensorEnrichmentConfig);

    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;
    component.getEnrichmentData();


    expect(component.sensorEnrichmentConfig).toEqual(sensorEnrichmentConfig);
    expect(component.aggregationConfigKeys).toEqual(expected);
  }));

  let setDataForSensorOperation = function () {
    let sensorParserInfo = new SensorParserConfigHistory();
    let sensorParserConfig = new SensorParserConfig();
    let kafkaTopic = new KafkaTopic();
    let topologyStatus = new TopologyStatus();

    sensorParserConfig.sensorTopic = 'bro';
    sensorParserConfig.parserClassName = 'org.apache.metron.parsers.GrokParser';
    sensorParserConfig.parserConfig = {grokPattern: 'SQUID_DELIMITED squid grok statement'};
    sensorParserInfo.config = sensorParserConfig;

    kafkaTopic.name = 'bro';
    kafkaTopic.numPartitions = 1;
    kafkaTopic.replicationFactor = 1;

    topologyStatus.name = 'bro';
    topologyStatus.latency = '10.1';
    topologyStatus.throughput = '15.2';

    let broEnrichment = {
      'fieldMap': {
        'geo': ['ip_dst_addr'],
        'host': ['ip_dst_addr'],
        'whois': [],
        'stellar': {'config': {'group1': {}}}
      },
      'fieldToTypeMap': {}, 'config': {}
    };
    let broThreatIntel = {'threatIntel': {
      'fieldMap': { 'hbaseThreatIntel': ['ip_dst_addr'] },
      'fieldToTypeMap': { 'ip_dst_addr': ['malicious_ip'] }
    }
    };
    let broEnrichments = new SensorEnrichmentConfig();
    broEnrichments.enrichment = Object.assign(new EnrichmentConfig(),  broEnrichment);
    broEnrichments.threatIntel = Object.assign(new ThreatIntelConfig(), broThreatIntel);

    kafkaService.setForTest(kafkaTopic);
    stormService.setForTest(topologyStatus);
    sensorEnrichmentConfigService.setForTest(broEnrichments);
    sensorParserConfigHistoryService.setForTest(sensorParserInfo);
  };

  it('onStartSensor should  start sensor', async(() => {
    spyOn(stormService, 'startParser').and.returnValue(Observable.create(observer => {
      observer.next({});
      observer.complete();
    }));

    alerts.showSuccessMessage = jasmine.createSpy('showSuccessMessage');
    setDataForSensorOperation();

    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;
    component.selectedSensorName = 'abc';

    component.onStartSensor();

    expect(stormService.startParser).toHaveBeenCalledWith('abc');
    expect(alerts.showSuccessMessage).toHaveBeenCalledWith('Started sensor abc');
  }));

  it('onStopSensor should stop the sensor', async(() => {
    spyOn(stormService, 'stopParser').and.returnValue(Observable.create(observer => {
      observer.next({});
      observer.complete();
    }));

    alerts.showSuccessMessage = jasmine.createSpy('showSuccessMessage');
    setDataForSensorOperation();

    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;
    component.selectedSensorName = 'abc';

    component.onStopSensor();

    expect(stormService.stopParser).toHaveBeenCalledWith('abc');
    expect(alerts.showSuccessMessage).toHaveBeenCalledWith('Stopped sensor abc');
  }));

  it('onEnableSensor should enable sensor', async(() => {
    spyOn(stormService, 'activateParser').and.returnValue(Observable.create(observer => {
      observer.next({});
      observer.complete();
    }));

    alerts.showSuccessMessage = jasmine.createSpy('showSuccessMessage');
    setDataForSensorOperation();

    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;
    component.selectedSensorName = 'abc';

    component.onEnableSensor();

    expect(stormService.activateParser).toHaveBeenCalledWith('abc');
    expect(alerts.showSuccessMessage).toHaveBeenCalledWith('Enabled sensor abc');
  }));

  it('onDisableSensor should disable the sensor', async(() => {
    spyOn(stormService, 'deactivateParser').and.returnValue(Observable.create(observer => {
      observer.next({});
      observer.complete();
    }));

    alerts.showSuccessMessage = jasmine.createSpy('showSuccessMessage');
    setDataForSensorOperation();

    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;
    component.selectedSensorName = 'abc';

    component.onDisableSensor();

    expect(stormService.deactivateParser).toHaveBeenCalledWith('abc');
    expect(alerts.showSuccessMessage).toHaveBeenCalledWith('Disabled sensor abc');
  }));

  it('onDeleteSensor should delete the sensor', async(() => {
    spyOn(sensorParserConfigService, 'deleteSensorParserConfig').and.returnValue(Observable.create(observer => {
      observer.next({});
      observer.complete();
    }));

    alerts.showSuccessMessage = jasmine.createSpy('showSuccessMessage');
    router.navigateByUrl = jasmine.createSpy('navigateByUrl');
    setDataForSensorOperation();

    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;
    component.selectedSensorName = 'abc';

    component.onDeleteSensor();

    expect(sensorParserConfigService.deleteSensorParserConfig).toHaveBeenCalledWith('abc');
    expect(alerts.showSuccessMessage).toHaveBeenCalledWith('Deleted sensor abc');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/sensors');
  }));

  it('toggleStartStopInProgress should toggle the variable for showing progressbar', async(() => {
    let component: SensorParserConfigReadonlyComponent = fixture.componentInstance;
    expect(component.startStopInProgress).toEqual(false);

    component.startStopInProgress = true;
    expect(component.startStopInProgress).toEqual(true);

    component.startStopInProgress = false;
    expect(component.startStopInProgress).toEqual(false);
  }));

});
