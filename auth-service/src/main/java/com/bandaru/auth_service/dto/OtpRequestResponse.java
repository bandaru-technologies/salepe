package com.bandaru.auth_service.dto;

/**
 * No SMS provider is wired up yet, so the generated OTP is returned in the
 * response itself for the frontend to display on screen. Replace this with
 * a real SMS gateway integration before going to production, and stop
 * returning {@code otp} in the response.
 */
public record OtpRequestResponse(
        String phoneNumber,
        String otp,
        int expiresInSeconds
) {
}
