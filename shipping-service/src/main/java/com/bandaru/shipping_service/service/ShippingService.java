package com.bandaru.shipping_service.service;

import com.bandaru.shipping_service.dto.OrderEvent;
import com.bandaru.shipping_service.model.Shipment;
import com.bandaru.shipping_service.model.ShipmentStatus;
import com.bandaru.shipping_service.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ShippingService {

    private final ShipmentRepository shipmentRepository;

    @Transactional
    public Shipment createShipment(OrderEvent event) {
        if (shipmentRepository.findByOrderId(event.orderId()).isPresent()) {
            log.info("Shipment already created for orderId={}, skipping (idempotent)", event.orderId());
            return shipmentRepository.findByOrderId(event.orderId()).get();
        }

        Shipment shipment = Shipment.builder()
                .orderId(event.orderId())
                .customerId(event.customerId())
                .status(ShipmentStatus.PENDING)
                .build();

        Shipment saved = shipmentRepository.save(shipment);
        log.info("Created shipment orderId={} status={}", event.orderId(), saved.getStatus());
        return saved;
    }
}
