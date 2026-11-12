package com.bandaru.auth_service.controller;

import com.bandaru.auth_service.dto.*;
import com.bandaru.auth_service.service.OtpService;
import com.bandaru.auth_service.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final OtpService otpService;
    private final SessionService sessionService;

    @PostMapping("/otp/request")
    public ResponseEntity<OtpRequestResponse> requestOtp(@Valid @RequestBody OtpRequest request) {
        String otp = otpService.generate(request.phoneNumber());
        return ResponseEntity.ok(new OtpRequestResponse(request.phoneNumber(), otp, otpService.ttlSeconds()));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<OtpVerifyResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        OtpService.VerifyResult result = otpService.verify(request.phoneNumber(), request.otp());
        switch (result) {
            case SUCCESS -> {
                String token = sessionService.createSession(request.phoneNumber());
                return ResponseEntity.ok(
                        new OtpVerifyResponse(token, request.phoneNumber(), sessionService.ttlSeconds()));
            }
            case NOT_FOUND -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No OTP was requested for this phone number");
            case EXPIRED -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "OTP has expired, please request a new one");
            case TOO_MANY_ATTEMPTS -> throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Too many incorrect attempts, please request a new OTP");
            default -> throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect OTP");
        }
    }

    @GetMapping("/session")
    public ResponseEntity<SessionResponse> session(@RequestHeader("Authorization") String authorization) {
        String token = authorization.replaceFirst("(?i)^Bearer ", "");
        return sessionService.resolve(token)
                .map(phone -> ResponseEntity.ok(new SessionResponse(true, phone)))
                .orElseGet(() -> ResponseEntity.ok(new SessionResponse(false, null)));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authorization) {
        String token = authorization.replaceFirst("(?i)^Bearer ", "");
        sessionService.invalidate(token);
        return ResponseEntity.noContent().build();
    }
}
