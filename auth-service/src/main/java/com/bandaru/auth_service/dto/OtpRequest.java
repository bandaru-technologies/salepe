package com.bandaru.auth_service.dto;

import jakarta.validation.constraints.Pattern;

public record OtpRequest(
        @Pattern(regexp = "^[0-9]{10}$", message = "phoneNumber must be a 10-digit number")
        String phoneNumber
) {
}
