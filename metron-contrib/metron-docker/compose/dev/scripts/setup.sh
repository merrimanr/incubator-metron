#!/bin/bash
#
#  Licensed to the Apache Software Foundation (ASF) under one or more
#  contributor license agreements.  See the NOTICE file distributed with
#  this work for additional information regarding copyright ownership.
#  The ASF licenses this file to You under the Apache License, Version 2.0
#  (the "License"); you may not use this file except in compliance with
#  the License.  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#
DOCKER_IP_ADDRESS=`docker-machine ip metron-machine`
SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COMPOSE_DIRECTORY="$SCRIPT_DIRECTORY/.."
METRON_DOCKER_DIRECTORY="$SCRIPT_DIRECTORY/../../.."

echo Waiting for Elasticsearch to start
$METRON_DOCKER_DIRECTORY/scripts/wait_for_elasticsearch.sh $DOCKER_IP_ADDRESS 9210

echo Waiting for REST to start
$METRON_DOCKER_DIRECTORY/scripts/wait_for_rest.sh $DOCKER_IP_ADDRESS 8082

echo
echo Loading Elasticsearch templates for bro, snort and error
$SCRIPT_DIRECTORY/load_elasticsearch_template.sh bro
$SCRIPT_DIRECTORY/load_elasticsearch_template.sh snort
$SCRIPT_DIRECTORY/load_elasticsearch_template.sh error

echo
echo Creating Kafka topics
for topic in 'bro' 'snort' 'enrichments' 'indexing'; do
    curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "name": "'$topic'", "numPartitions": 1, "replicationFactor": 1}' 'http://user:password@'$DOCKER_IP_ADDRESS':8082/api/v1/kafka/topic' &>/dev/null
    echo Created topic $topic
done

echo
echo Loading Geo database
cd $COMPOSE_DIRECTORY && docker-compose exec hadoop /bin/sh -c "cd /tmp && curl -O http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz" &>/dev/null
echo Downloaded Geo database
cd $COMPOSE_DIRECTORY && docker-compose exec hadoop /bin/sh -c "/usr/local/hadoop/bin/hdfs dfs -mkdir /apps" &>/dev/null
cd $COMPOSE_DIRECTORY && docker-compose exec hadoop /bin/sh -c "/usr/local/hadoop/bin/hdfs dfs -mkdir /apps/metron" &>/dev/null
cd $COMPOSE_DIRECTORY && docker-compose exec hadoop /bin/sh -c "/usr/local/hadoop/bin/hdfs dfs -mkdir /apps/metron/geo" &>/dev/null
cd $COMPOSE_DIRECTORY && docker-compose exec hadoop /bin/sh -c "/usr/local/hadoop/bin/hdfs dfs -mkdir /apps/metron/geo/default" &>/dev/null
cd $COMPOSE_DIRECTORY && docker-compose exec hadoop /bin/sh -c "/usr/local/hadoop/bin/hdfs dfs -put /tmp/GeoLite2-City.mmdb.gz /apps/metron/geo/default" &>/dev/null
echo Uploaded Geo database to HDFS

echo
echo Creating HBase tables
cd $COMPOSE_DIRECTORY && docker-compose exec metron /bin/sh -c "echo \"create 'enrichment','t'\" | hbase shell" &>/dev/null
echo Created table enrichment
cd $COMPOSE_DIRECTORY && docker-compose exec metron /bin/sh -c "echo \"create 'threatintel','t'\" | hbase shell" &>/dev/null
echo Created table threatintel
cd $COMPOSE_DIRECTORY && docker-compose exec metron /bin/sh -c "echo \"create 'metron_update','t'\" | hbase shell" &>/dev/null
echo Created table metron_update
cd $COMPOSE_DIRECTORY && docker-compose exec metron /bin/sh -c "echo \"create 'profiler','P'\" | hbase shell" &>/dev/null
echo Created table profiler
cd $COMPOSE_DIRECTORY && docker-compose exec metron /bin/sh -c "echo \"create 'user_settings','cf'\" | hbase shell" &>/dev/null
echo Created table user_settings

echo
echo Starting Parser topologies
for sensor in 'bro' 'snort'; do
    cd $COMPOSE_DIRECTORY && docker-compose exec metron ./bin/start_parser_topology.sh -k kafka:9092 -z zookeeper:2181 -s $sensor &>/dev/null
    echo $sensor topology started
done

echo
echo Starting Enrichment topology
cd $COMPOSE_DIRECTORY && docker-compose exec metron ./bin/start_enrichment_topology.sh &>/dev/null
echo Enrichment topology started

echo
echo Starting Indexing topology
cd $COMPOSE_DIRECTORY && docker-compose exec metron ./bin/start_elasticsearch_topology.sh &>/dev/null
echo Indexing topology started

