package com.bandaru.auth_service.dto;

public record OtpVerifyResponse(
        String token,
        String phoneNumber,
        int expiresInSeconds
) {
}
