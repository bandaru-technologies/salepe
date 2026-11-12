package com.bandaru.shipping_service.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Mirrors the OrderEvent published by order-service to "order-topic".
 * Consumed independently here by the Shipping Service.
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
