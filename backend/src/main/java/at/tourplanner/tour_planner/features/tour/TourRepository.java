package at.tourplanner.tour_planner.features.tour;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    // find tours of a specific user
    List<Tour> findByUserId(Long userId);

    // find tours with a specific transport type
    List<Tour> findByTransportTypeId(Long transportTypeId);
}
