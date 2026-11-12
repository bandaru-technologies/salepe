package com.bandaru.order_service.kafka;

import com.bandaru.order_service.dto.OrderEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class OrderEventProducer {

    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;

    /**
     * Publishes the order event keyed by orderId so all events for the
     * same order land on the same partition and preserve ordering.
     */
    public void publish(OrderEvent event) {
        String key = event.orderId().toString();
        kafkaTemplate.send(KafkaTopics.ORDER_TOPIC, key, event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to publish OrderEvent for orderId={}", event.orderId(), ex);
                    } else {
                        log.info("Published OrderEvent orderId={} status={} to partition={} offset={}",
                                event.orderId(), event.status(),
                                result.getRecordMetadata().partition(),
                                result.getRecordMetadata().offset());
                    }
                });
    }
}
