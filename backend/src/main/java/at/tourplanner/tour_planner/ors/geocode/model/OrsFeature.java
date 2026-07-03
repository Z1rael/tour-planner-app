package at.tourplanner.tour_planner.ors.geocode.model;

public record OrsFeature(
        OrsFeatureProperties properties,
        OrsGeometry geometry
) {}
