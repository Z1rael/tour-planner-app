package at.tourplanner.tour_planner.api.dto.tour;

import jakarta.validation.constraints.Size;

public record UpdateTourRequest(
        @Size(min = 3, max = 255) String name,
        String description
) {}