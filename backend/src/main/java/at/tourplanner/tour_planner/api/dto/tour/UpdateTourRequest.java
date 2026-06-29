package at.tourplanner.tour_planner.api.dto.tour;

import at.tourplanner.tour_planner.api.dto.geocode.GeocodeDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateTourRequest(
        @NotBlank @Size(min = 3, max = 255)
        String name,
        String description,
        @NotNull GeocodeDTO fromGeocode,
        @NotNull GeocodeDTO toGeocode,
        @NotNull String profile    // "driving-car", "cycling-regular" etc.
) {}