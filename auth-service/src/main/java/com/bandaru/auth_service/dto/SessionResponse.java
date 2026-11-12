package com.bandaru.auth_service.dto;

public record SessionResponse(
        boolean valid,
        String phoneNumber
) {
}
