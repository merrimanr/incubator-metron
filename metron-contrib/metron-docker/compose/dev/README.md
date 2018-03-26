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
# Metron Docker

Metron Docker Dev is a [Docker Compose](https://docs.docker.com/compose/overview/) application that serves as a Metron development environment.

Metron Docker Dev includes these images that have been customized for Metron:

  - Kafka
  - Zookeeper
  - HBase
  - Elasticsearch
  - Metron including REST and Storm topologies

Setup
-----

Install [Docker for Mac](https://docs.docker.com/docker-for-mac/) or [Docker for Windows](https://docs.docker.com/docker-for-windows/).  The following versions have been tested:

  - Docker version 17.12.0-ce
  - docker-machine version 0.13.0
  - docker-compose version 1.18.0

Build Metron from the top level directory with:
```
$ cd $METRON_HOME
$ mvn clean install -DskipTests
```

Create a Docker machine:
```
$ export METRON_DOCKER_HOME=$METRON_HOME/metron-contrib/metron-docker
$ cd $METRON_DOCKER_HOME
$ ./scripts/create-docker-machine.sh
```

This will create a host called "metron-machine".  Anytime you want to run Docker commands against this host, make sure you run this first to set the Docker environment variables:
```
$ eval "$(docker-machine env metron-machine)"
```

If you wish to use a local docker-engine install, please set an environment variable BROKER_IP_ADDR to the IP address of your host machine. This cannot be the loopback address.

Usage
-----

Navigate to the compose application root:
```
$ export METRON_DOCKER_DEV_HOME=$METRON_DOCKER_HOME/compose/dev
$ cd $METRON_DOCKER_DEV_HOME
```

The Metron Docker environment lifecycle is controlled by the [docker-compose](https://docs.docker.com/compose/reference/overview/) command.  The service names can be found in the docker-compose.yml file.  For example, to build and start the environment run this command:
```
$ eval "$(docker-machine env metron-machine)"
$ docker-compose up -d
```

After all services have started list the containers and ensure their status is 'Up':
```
$ docker-compose ps

    Name                   Command               State                       Ports                     
-------------------------------------------------------------------------------------------------------
elasticsearch   /bin/bash bin/es-docker          Up      0.0.0.0:9210->9200/tcp, 0.0.0.0:9310->9300/tcp
hbase           /bin/sh -c ./bin/start-hba ...   Up      0.0.0.0:16010->16010/tcp                      
kafka           start-kafka.sh                   Up      0.0.0.0:9092->9092/tcp                        
metron          /bin/sh -c ./bin/start.sh        Up      0.0.0.0:8082->8082/tcp                        
nimbus          /docker-entrypoint.sh stor ...   Up      0.0.0.0:6627->6627/tcp                        
storm-ui        /docker-entrypoint.sh storm ui   Up      0.0.0.0:8000->8000/tcp, 0.0.0.0:8080->8080/tcp
supervisor      /docker-entrypoint.sh stor ...   Up                                                    
zookeeper       /docker-entrypoint.sh zkSe ...   Up      0.0.0.0:2181->2181/tcp, 2888/tcp, 3888/tcp      
```

Various services are exposed through http on the Docker host.  Use the docker-machine CLI to get the host ip:
```
$ docker-machine ip metron-machine

192.168.99.100
```

The various services can be accessed through this ip address.  For example, using the ip address above:

 - Metron REST is available at `http://192.168.99.100:8082/swagger-ui.html`
 - Elasticsearch is available at `http://192.168.99.100:9210/_cat/indices?v` 
 - HBase is available at `http://192.168.99.100:16010/master-status`
 - Storm UI is available at `http://192.168.99.100:8080/`

Generating Sensor Data
-----

Some convenience scripts are included to facilitate streaming sensor data, similar to the Sensor stubs in full dev.

First run the script at `$METRON_DOCKER_DEV_HOME/scripts/setup.sh`.  This will install, create and start various components needed to ingest sensor data.  The output will look like:
```
Waiting for Elasticsearch to start
Elasticsearch is up after waiting 0 seconds

Loading Elasticsearch templates for bro, snort and error
Loaded template for bro
Loaded template for snort
Loaded template for error

Creating HBase tables
Created table user_settings

Starting Indexing topology
Indexing topology started
```

Once this has finished the environment is ready for data.  Convenience scripts for generating and producing data to the indexing topology are included in `$METRON_DOCKER_DEV_HOME/scripts/sensors`.
 
To generate bro data, execute the script at `$METRON_DOCKER_DEV_HOME/scripts/sensors/start_bro.sh` in a separate window and leave it running.  This will generate data using the performance load tool included with Metron.  The output will look similar to:
```
Starting bro sample sensor
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
Consumer Group: metron.load.group
Thread pool size: 2
Generating data to indexing at 100 events per second
Sending 10 messages to indexing every 100ms
Monitoring indexing every 10000 ms
Summarizing over the last 5 monitoring periods (50000ms)
2018/03/21 22:13:49 - 103 eps generated to indexing (Mean: 103, Std Dev: 0)
2018/03/21 22:13:59 - 99 eps generated to indexing (Mean: 101, Std Dev: 2)
                      100 eps throughput measured for indexing (Mean: 100, Std Dev: 0)
2018/03/21 22:14:09 - 100 eps generated to indexing (Mean: 100, Std Dev: 2)
                      100 eps throughput measured for indexing (Mean: 100, Std Dev: 0)

```

Bro data should now be flowing through the Storm indexing topology and available in Elasticsearch or through the search endpoints in Metron REST:
```
$ curl -XGET http://192.168.99.100:9210/_cat/indices?v

health status index                   uuid                   pri rep docs.count docs.deleted store.size pri.store.size
yellow open   bro_index_2018.03.21.22 E1F_NLC1SMGYgSW8fhRPyA   5   1      63720            0     36.2mb         36.2mb

$ curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "query": "*", "from": 0, "size": 1, "fields":["ip_src_addr"]}' 'http://user:password@192.168.99.100:8082/api/v1/search/search'

{"total":63720,"results":[{"id":"00000000-0000-0000-0000-85","source":{"ip_src_addr":"127.0.0.1"},"score":1.0,"index":"bro_index_2018.03.21.22"}],"facetCounts":null}
```



