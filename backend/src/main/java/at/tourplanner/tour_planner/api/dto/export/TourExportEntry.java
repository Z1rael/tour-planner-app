package at.tourplanner.tour_planner.api.dto.export;

import at.tourplanner.tour_planner.api.dto.tourlog.TourLogResponse;

import java.util.List;

public record TourExportEntry(
        String name,
        String description,
        String fromAddress,
        String toAddress,
        String transportTypeName,
        double distanceKm,
        long estimatedTimeS,
        List<TourLogResponse> logs
) {}