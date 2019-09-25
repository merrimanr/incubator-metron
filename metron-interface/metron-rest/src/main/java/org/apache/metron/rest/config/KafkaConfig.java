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
package org.apache.metron.rest.config;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.KafkaAdminClient;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.security.auth.SecurityProtocol;
import org.apache.metron.common.utils.KafkaUtils;
import org.apache.metron.rest.MetronRestConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import java.util.HashMap;
import java.util.Map;

import static org.apache.metron.rest.MetronRestConstants.TEST_PROFILE;

/**
 * Configuration used for connecting to Kafka.
 */
@Configuration
@Profile("!" + TEST_PROFILE)
public class KafkaConfig {
  /**
   * The Spring environment.
   */
  private Environment environment;

  /**
   * Construvtor used to inject {@link Environment}.
   * @param environment Spring environment to inject.
   */
  @Autowired
  public KafkaConfig(final Environment environment) {
    this.environment = environment;
  }

  /**
   * Create properties that will be used by {@link org.apache.metron.rest.config.KafkaConfig#createConsumerFactory()}
   *
   * @return Configurations used by {@link org.apache.metron.rest.config.KafkaConfig#createConsumerFactory()}.
   */
  @Bean
  public Map<String, Object> consumerProperties() {
    final Map<String, Object> props = new HashMap<>();
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, environment.getProperty(MetronRestConstants.KAFKA_BROKER_URL_SPRING_PROPERTY));
    props.put(ConsumerConfig.GROUP_ID_CONFIG, "metron-rest");
    props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");
    props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");
    props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "30000");
    props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
    props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
    if (environment.getProperty(MetronRestConstants.KERBEROS_ENABLED_SPRING_PROPERTY, Boolean.class, false)) {
      props.put("security.protocol", KafkaUtils.INSTANCE.normalizeProtocol(environment.getProperty(MetronRestConstants.KAFKA_SECURITY_PROTOCOL_SPRING_PROPERTY)));
    }
    return props;
  }

  /**
   * Create a {@link ConsumerFactory} which will be used for certain Kafka interactions within config API.
   *
   * @return a {@link ConsumerFactory} used to create {@link KafkaConsumer} for interactions with Kafka.
   */
  @Bean
  public ConsumerFactory<String, String> createConsumerFactory() {
    return new DefaultKafkaConsumerFactory<>(consumerProperties());
  }

  @Bean
  public Map<String, Object> producerProperties() {
    Map<String, Object> producerConfig = new HashMap<>();
    producerConfig.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, environment.getProperty(MetronRestConstants.KAFKA_BROKER_URL_SPRING_PROPERTY));
    producerConfig.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
    producerConfig.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
    producerConfig.put(ProducerConfig.ACKS_CONFIG, "1");
    if (environment.getProperty(MetronRestConstants.KERBEROS_ENABLED_SPRING_PROPERTY, Boolean.class, false)) {
      producerConfig.put("security.protocol", KafkaUtils.INSTANCE.normalizeProtocol(environment.getProperty(MetronRestConstants.KAFKA_SECURITY_PROTOCOL_SPRING_PROPERTY)));
    }
    return producerConfig;
  }


  /**
   * The {@link KafkaProducer} is thread-safe so we can reuse it across the application.
   * @return
   */
  @Bean
  public KafkaProducer kafkaProducer() {
    return new KafkaProducer<>(producerProperties());
  }

  /**
   * Create a bean for {@link AdminClient}. This is primarily done to make testing a bit easier.
   *
   * @return adminClient
   */
  @Bean
  public AdminClient adminClient() {
    Map<String, Object> adminConfig = new HashMap<>();
    adminConfig.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, environment.getProperty(MetronRestConstants.KAFKA_BROKER_URL_SPRING_PROPERTY));
    return KafkaAdminClient.create(adminConfig);
  }
}
