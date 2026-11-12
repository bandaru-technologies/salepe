package com.bandaru.payment_service.service;

import com.bandaru.payment_service.dto.OrderEvent;
import com.bandaru.payment_service.model.Payment;
import com.bandaru.payment_service.model.PaymentStatus;
import com.bandaru.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Transactional
    public Payment processPayment(OrderEvent event) {
        if (paymentRepository.findByOrderId(event.orderId()).isPresent()) {
            log.info("Payment already processed for orderId={}, skipping (idempotent)", event.orderId());
            return paymentRepository.findByOrderId(event.orderId()).get();
        }

        // Simulated payment processing - replace with a real payment gateway integration.
        PaymentStatus status = PaymentStatus.SUCCESS;

        Payment payment = Payment.builder()
                .orderId(event.orderId())
                .customerId(event.customerId())
                .amount(event.totalAmount())
                .status(status)
                .build();

        Payment saved = paymentRepository.save(payment);
        log.info("Processed payment orderId={} amount={} status={}", event.orderId(), event.totalAmount(), status);
        return saved;
    }
}
