package com.bandaru.auth_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Issues and validates opaque bearer tokens after a successful OTP
 * verification. In-memory only — suitable for a single-instance dev/demo
 * deployment. Swap for signed JWTs or a shared session store (Redis) if
 * this service is ever scaled horizontally.
 */
@Service
public class SessionService {

    private record Session(String phoneNumber, Instant expiresAt) {
    }

    private final Map<String, Session> sessions = new ConcurrentHashMap<>();

    @Value("${app.session.ttl-seconds:86400}")
    private int ttlSeconds;

    public int ttlSeconds() {
        return ttlSeconds;
    }

    public String createSession(String phoneNumber) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, new Session(phoneNumber, Instant.now().plusSeconds(ttlSeconds)));
        return token;
    }

    public Optional<String> resolve(String token) {
        Session session = sessions.get(token);
        if (session == null) {
            return Optional.empty();
        }
        if (Instant.now().isAfter(session.expiresAt())) {
            sessions.remove(token);
            return Optional.empty();
        }
        return Optional.of(session.phoneNumber());
    }

    public void invalidate(String token) {
        sessions.remove(token);
    }
}
