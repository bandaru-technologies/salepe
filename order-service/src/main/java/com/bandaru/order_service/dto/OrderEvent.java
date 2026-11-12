package com.bandaru.order_service.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Event published to the "order-topic" Kafka topic whenever an order
 * changes state. Consumed independently by Payment, Notification,
 * Analytics and Shipping services.
 */
public record OrderEvent(
        UUID orderId,
        String customerId,
        String status,
        BigDecimal totalAmount,
        List<Item> items,
        Instant occurredAt
) {
    public record Item(String productId, String productName, int quantity, BigDecimal price) {
    }
}
