package at.tourplanner.tour_planner.api.dto.tour;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTourRequest(
        @NotBlank @Size(min = 3, max = 255)
        String name,
        String description,

        @NotNull double fromLat,
        @NotNull double fromLng,
        @NotNull double toLat,
        @NotNull double toLng,
        @NotNull String profile,    // "driving-car", "cycling-regular" etc.

        Long transportTypeId
) {
}
