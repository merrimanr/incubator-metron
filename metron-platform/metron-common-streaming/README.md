<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
# Tracing
Metron 

## Configuration
Tracing can be configured in the global config by setting properties in the `trace.settings` object.  The following properties are available:
* `trace.enabled` - Set this to true to enable tracing.  Default is false.
* `trace.sensors` - A list of sensors to include in tracing.  An empty list or null value enables all sensors.  Default is all sensors.
* `traces.per.second` - Sets the frequency of traces in traces per second.  Default is 1 trace per second.

For example, the configuration for tracing for bro messages would be:
```
{
  "trace.settings": {
    "trace.enabled": true,
    "trace.sensors": [ "bro" ]
  }
}
```


## Development
Tracing can be tested or developed against by running Jaeger in a Docker container.  Install and start Docker in full dev:
```
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
```

Next start up a Jaeger container:
```
docker run -d -p 5775:5775/udp -p 16686:16686 jaegertracing/all-in-one:latest
```

The Jaeger UI will be available at `http://node1:16686/search`.
