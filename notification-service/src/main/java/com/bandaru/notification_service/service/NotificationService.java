package com.bandaru.notification_service.service;

import com.bandaru.notification_service.dto.OrderEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    /**
     * Stub for sending a customer notification (email/SMS/push). Replace
     * with a real provider integration (e.g. SendGrid, Twilio, FCM).
     */
    public void notifyCustomer(OrderEvent event) {
        String message = switch (event.status()) {
            case "CREATED" -> "Your order has been placed successfully.";
            case "PAID" -> "Payment received for your order.";
            case "SHIPPED" -> "Your order has been shipped.";
            case "DELIVERED" -> "Your order has been delivered.";
            case "CANCELLED" -> "Your order has been cancelled.";
            default -> "Order status updated: " + event.status();
        };
        log.info("Sending notification to customerId={} for orderId={}: \"{}\"",
                event.customerId(), event.orderId(), message);
    }
}
