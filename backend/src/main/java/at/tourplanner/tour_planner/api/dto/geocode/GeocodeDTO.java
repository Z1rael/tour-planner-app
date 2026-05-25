package at.tourplanner.tour_planner.api.dto.geocode;

public record GeocodeDTO(
        String label,
        double lat,
        double lng
) {}
