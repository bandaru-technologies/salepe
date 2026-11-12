package com.bandaru.auth_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record OtpVerifyRequest(
        @Pattern(regexp = "^[0-9]{10}$", message = "phoneNumber must be a 10-digit number")
        String phoneNumber,

        @NotBlank(message = "otp is required")
        String otp
) {
}
