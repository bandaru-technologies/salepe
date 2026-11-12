package com.bandaru.analytics_service.service;

import com.bandaru.analytics_service.dto.AnalyticsSummary;
import com.bandaru.analytics_service.dto.OrderEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.LongAdder;
import java.util.stream.Collectors;

/**
 * In-memory analytics aggregation. For production, replace with a
 * durable store (e.g. Postgres, a time-series DB, or a stream
 * processing topology such as Kafka Streams).
 */
@Service
@Slf4j
public class AnalyticsService {

    private final LongAdder totalOrders = new LongAdder();
    private final AtomicBigDecimal totalRevenue = new AtomicBigDecimal();
    private final Map<String, LongAdder> ordersByStatus = new ConcurrentHashMap<>();

    public void record(OrderEvent event) {
        totalOrders.increment();
        totalRevenue.add(event.totalAmount());
        ordersByStatus.computeIfAbsent(event.status(), s -> new LongAdder()).increment();
        log.info("Recorded analytics for orderId={} status={} amount={}",
                event.orderId(), event.status(), event.totalAmount());
    }

    public AnalyticsSummary summary() {
        Map<String, Long> byStatus = ordersByStatus.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().sum()));
        return new AnalyticsSummary(totalOrders.sum(), totalRevenue.get(), byStatus);
    }

    /** Minimal thread-safe BigDecimal accumulator. */
    private static final class AtomicBigDecimal {
        private volatile BigDecimal value = BigDecimal.ZERO;

        synchronized void add(BigDecimal amount) {
            if (amount != null) {
                value = value.add(amount);
            }
        }

        BigDecimal get() {
            return value;
        }
    }
}
