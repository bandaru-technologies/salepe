package com.bandaru.notification_service.kafka;

import com.bandaru.notification_service.dto.OrderEvent;
import com.bandaru.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class OrderEventListener {

    private static final String TOPIC = "order-topic";

    private final NotificationService notificationService;

    @KafkaListener(topics = TOPIC, groupId = "notification-service")
    public void onOrderEvent(OrderEvent event) {
        log.info("notification-service received OrderEvent orderId={} status={}", event.orderId(), event.status());
        notificationService.notifyCustomer(event);
    }
}
