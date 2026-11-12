package com.bandaru.shipping_service.kafka;

import com.bandaru.shipping_service.dto.OrderEvent;
import com.bandaru.shipping_service.service.ShippingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class OrderEventListener {

    private static final String TOPIC = "order-topic";

    private final ShippingService shippingService;

    @KafkaListener(topics = TOPIC, groupId = "shipping-service")
    public void onOrderEvent(OrderEvent event) {
        log.info("shipping-service received OrderEvent orderId={} status={}", event.orderId(), event.status());
        shippingService.createShipment(event);
    }
}
