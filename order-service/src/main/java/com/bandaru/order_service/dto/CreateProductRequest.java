package com.bandaru.order_service.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record CreateProductRequest(
        @NotBlank(message = "name is required") String name,
        String description,
        @DecimalMin(value = "0.0", inclusive = false, message = "price must be positive") BigDecimal price,
        String imageUrl,
        @Min(value = 0, message = "stock cannot be negative") int stock
) {
}
