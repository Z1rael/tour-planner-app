package at.tourplanner.tour_planner.api.dto.tourlog;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record UpdateTourLogRequest(
        String comment,
        @Min(1) @Max(5) Integer difficulty,
        @Min(1) @Max(5) Integer rating,
        @Min(0) Long totalTimeS,
        @DecimalMin("0.0") BigDecimal totalDistanceKm
) {}