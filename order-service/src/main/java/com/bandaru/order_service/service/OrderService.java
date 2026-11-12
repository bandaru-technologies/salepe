package com.bandaru.order_service.service;

import com.bandaru.order_service.dto.CreateOrderRequest;
import com.bandaru.order_service.dto.OrderEvent;
import com.bandaru.order_service.kafka.OrderEventProducer;
import com.bandaru.order_service.model.Order;
import com.bandaru.order_service.model.OrderItem;
import com.bandaru.order_service.model.OrderStatus;
import com.bandaru.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderEventProducer orderEventProducer;

    @Transactional
    public Order placeOrder(CreateOrderRequest request) {
        Order order = Order.builder()
                .customerId(request.customerId())
                .status(OrderStatus.CREATED)
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (CreateOrderRequest.OrderItemRequest itemReq : request.items()) {
            OrderItem item = OrderItem.builder()
                    .productId(itemReq.productId())
                    .productName(itemReq.productName())
                    .quantity(itemReq.quantity())
                    .price(itemReq.price())
                    .build();
            order.addItem(item);
            total = total.add(itemReq.price().multiply(BigDecimal.valueOf(itemReq.quantity())));
        }
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);
        orderEventProducer.publish(toEvent(saved));
        return saved;
    }

    @Transactional(readOnly = true)
    public Order getOrder(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Order not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Order> listOrders() {
        return orderRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Order> listOrdersByCustomer(String customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    private OrderEvent toEvent(Order order) {
        List<OrderEvent.Item> items = order.getItems().stream()
                .map(i -> new OrderEvent.Item(i.getProductId(), i.getProductName(), i.getQuantity(), i.getPrice()))
                .toList();
        return new OrderEvent(
                order.getId(),
                order.getCustomerId(),
                order.getStatus().name(),
                order.getTotalAmount(),
                items,
                Instant.now()
        );
    }
}
