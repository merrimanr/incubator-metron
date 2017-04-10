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

// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

/*global jasmine */
var SpecReporter = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 25000,
  suites: {
    all: [
      './e2e/login/login.e2e-spec.ts',
      './e2e/app/app.e2e-spec.ts',
      './e2e/sensor-list/sensor-list.e2e-spec.ts',
      './e2e/use-cases/sensor-config-single-parser.e2e-spec.ts',
      './e2e/sensor-list/sensor-list-parser-actions.e2e-spec.ts',
      './e2e/sensor-config-readonly/sensor-config-readonly.e2e-spec.ts'
    ]
  },
  specs: [
    './e2e/login/login.e2e-spec.ts',
    './e2e/app/app.e2e-spec.ts',
    // './e2e/sensor-list/sensor-list.e2e-spec.ts',
    './e2e/use-cases/sensor-config-single-parser.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 50000,
    print: function() {}
  },
  useAllAngular2AppRoots: true,
  rootElement: 'metron-config-root',
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e'
    });
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(new SpecReporter());
    setTimeout(function() {
      browser.driver.executeScript(function() {
        return {
          width: window.screen.availWidth,
          height: window.screen.availHeight
        };
      }).then(function(result) {
        browser.driver.manage().window().setSize(result.width, result.height);
      });
    });
  }
};
