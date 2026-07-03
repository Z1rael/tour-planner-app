package at.tourplanner.tour_planner.ors.geocode.model;

import java.util.List;

public record OrsGeocodeResponse(
        List<OrsFeature> features
) {}
