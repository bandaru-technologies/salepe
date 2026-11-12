package com.bandaru.analytics_service.kafka;

import com.bandaru.analytics_service.dto.OrderEvent;
import com.bandaru.analytics_service.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class OrderEventListener {

    private static final String TOPIC = "order-topic";

    private final AnalyticsService analyticsService;

    @KafkaListener(topics = TOPIC, groupId = "analytics-service")
    public void onOrderEvent(OrderEvent event) {
        log.info("analytics-service received OrderEvent orderId={} status={}", event.orderId(), event.status());
        analyticsService.record(event);
    }
}
