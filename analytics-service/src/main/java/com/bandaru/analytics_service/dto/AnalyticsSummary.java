package com.bandaru.analytics_service.dto;

import java.math.BigDecimal;
import java.util.Map;

public record AnalyticsSummary(
        long totalOrders,
        BigDecimal totalRevenue,
        Map<String, Long> ordersByStatus
) {
}
