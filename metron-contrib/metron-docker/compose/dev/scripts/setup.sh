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

echo
echo Loading Elasticsearch templates for bro, snort and error
$SCRIPT_DIRECTORY/load_elasticsearch_template.sh bro
$SCRIPT_DIRECTORY/load_elasticsearch_template.sh snort
$SCRIPT_DIRECTORY/load_elasticsearch_template.sh error

echo
echo Creating HBase tables
cd $COMPOSE_DIRECTORY && docker-compose exec metron /bin/sh -c "echo \"create 'user_settings','cf'\" | hbase shell" &>/dev/null
echo Created table user_settings

echo
echo Starting Indexing topology
cd $COMPOSE_DIRECTORY && docker-compose exec metron ./bin/start_elasticsearch_topology.sh &>/dev/null
echo Indexing topology started

