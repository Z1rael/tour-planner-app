package at.tourplanner.tour_planner.api.dto.search;

import at.tourplanner.tour_planner.api.dto.tour.TourSummaryResponse;
import at.tourplanner.tour_planner.api.dto.tourlog.TourLogResponse;

import java.util.List;

public record SearchResponse(
        List<TourSummaryResponse> tours,
        List<TourLogResponse> logs
) {}