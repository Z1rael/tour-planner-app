package at.tourplanner.tour_planner.service;

import at.tourplanner.tour_planner.features.tour.TourRepository;
import jakarta.inject.Inject;
import org.springframework.stereotype.Service;

@Service
public class TourService {

    private final TourRepository tourRepository;

    @Inject
    public TourService(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }


}
