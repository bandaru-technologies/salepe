package com.bandaru.order_service.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    /**
     * Auto-creates the order-topic with 3 partitions (matching the
     * partition layout shown in the architecture diagram) so multiple
     * consumer instances of each downstream service can scale out.
     */
    @Bean
    public NewTopic orderTopic() {
        return TopicBuilder.name(KafkaTopics.ORDER_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
