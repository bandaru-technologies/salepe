package com.bandaru.auth_service.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-memory OTP store keyed by phone number. No SMS provider is wired up yet:
 * callers of {@link #generate(String)} get the raw code back so it can be
 * shown on screen instead of being sent via SMS. Suitable for local/dev use
 * only — swap for a shared store (e.g. Redis) before running multiple
 * instances of this service in production.
 */
@Service
@Slf4j
public class OtpService {

    private record OtpEntry(String code, Instant expiresAt, AtomicInteger attempts) {
    }

    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    @Value("${app.otp.length:6}")
    private int otpLength;

    @Value("${app.otp.ttl-seconds:300}")
    private int ttlSeconds;

    @Value("${app.otp.max-attempts:5}")
    private int maxAttempts;

    public int ttlSeconds() {
        return ttlSeconds;
    }

    public String generate(String phoneNumber) {
        String code = generateNumericCode(otpLength);
        otpStore.put(phoneNumber, new OtpEntry(code, Instant.now().plusSeconds(ttlSeconds), new AtomicInteger(0)));
        log.info("Generated OTP for phoneNumber={} (dev-mode: OTP returned to caller, not sent via SMS)", phoneNumber);
        return code;
    }

    public enum VerifyResult {
        SUCCESS, NOT_FOUND, EXPIRED, MISMATCH, TOO_MANY_ATTEMPTS
    }

    public VerifyResult verify(String phoneNumber, String submittedOtp) {
        OtpEntry entry = otpStore.get(phoneNumber);
        if (entry == null) {
            return VerifyResult.NOT_FOUND;
        }
        if (Instant.now().isAfter(entry.expiresAt())) {
            otpStore.remove(phoneNumber);
            return VerifyResult.EXPIRED;
        }
        if (entry.attempts().incrementAndGet() > maxAttempts) {
            otpStore.remove(phoneNumber);
            return VerifyResult.TOO_MANY_ATTEMPTS;
        }
        if (!entry.code().equals(submittedOtp)) {
            return VerifyResult.MISMATCH;
        }
        otpStore.remove(phoneNumber);
        return VerifyResult.SUCCESS;
    }

    private String generateNumericCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
