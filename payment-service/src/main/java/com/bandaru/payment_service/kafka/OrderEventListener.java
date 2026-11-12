package com.bandaru.payment_service.kafka;

import com.bandaru.payment_service.dto.OrderEvent;
import com.bandaru.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class OrderEventListener {

    private static final String TOPIC = "order-topic";

    private final PaymentService paymentService;

    @KafkaListener(topics = TOPIC, groupId = "payment-service")
    public void onOrderEvent(OrderEvent event) {
        log.info("payment-service received OrderEvent orderId={} status={}", event.orderId(), event.status());
        paymentService.processPayment(event);
    }
}
