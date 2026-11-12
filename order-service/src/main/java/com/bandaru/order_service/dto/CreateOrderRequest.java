package com.bandaru.order_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.math.BigDecimal;
import java.util.List;

public record CreateOrderRequest(
        @NotBlank(message = "customerId is required") String customerId,
        @NotEmpty(message = "items must not be empty") @Valid List<OrderItemRequest> items
) {
    public record OrderItemRequest(
            @NotBlank(message = "productId is required") String productId,
            @NotBlank(message = "productName is required") String productName,
            @Min(value = 1, message = "quantity must be at least 1") int quantity,
            @DecimalMin(value = "0.0", inclusive = false, message = "price must be positive") BigDecimal price
    ) {
    }
}
