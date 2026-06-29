package at.tourplanner.tour_planner.api.dto.tourlog;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CreateTourLogRequest(
        @NotNull Long tourId,

        @NotBlank String comment,

        @NotNull @Min(1) @Max(5) Integer difficulty,

        @NotNull @Min(1) @Max(5) Integer rating,

        @NotNull @Min(0) Long totalTimeS,

        @NotNull @Min(0) Long totalDistanceKm
) {}