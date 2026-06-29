package at.tourplanner.tour_planner.api.dto.tour;

import at.tourplanner.tour_planner.features.tour.Tour;

public record TourSummaryResponse(
        Long tourId,
        String name,
        String fromAddress,
        String toAddress,
        String transportTypeName,
        double distanceKm,
        long estimatedTimeS,
        int popularity,
        double childFriendliness,
        long creatorId
) {
    public static TourSummaryResponse from(Tour tour, int popularity, double childFriendliness) {
        return new TourSummaryResponse(
                tour.getTourId(),
                tour.getName(),
                tour.getFromAddress(),
                tour.getToAddress(),
                tour.getTransportType() != null ? tour.getTransportType().getTransportationName() : null,
                tour.getDistanceKm() != null ? tour.getDistanceKm() : 0,
                tour.getEstimatedTimeS() != null ? tour.getEstimatedTimeS() : 0,
                popularity,
                childFriendliness,
                tour.getUser().getUserId()
        );
    }
}