package at.tourplanner.tour_planner.features.tourlog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourLogRepository extends JpaRepository<TourLog, Long> {

    // find tour logs of a specific tour
    List<TourLog> findByTourId(Long tourId);

    // find tour logs of a specific user
    List<TourLog> findByUserId(Long userId);
}
