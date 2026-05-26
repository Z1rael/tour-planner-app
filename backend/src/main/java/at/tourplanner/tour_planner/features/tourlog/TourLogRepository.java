package at.tourplanner.tour_planner.features.tourlog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourLogRepository extends JpaRepository<TourLog, Long> {

    // find tour logs of a specific tour
    @Query("SELECT tl FROM TourLog tl WHERE tl.tour.tourId = :tourId")
    List<TourLog> findByTourId(@Param("tourId") Long tourId);

    // find tour logs of a specific user
    @Query("SELECT tl FROM TourLog tl WHERE tl.user.userId = :userId")
    List<TourLog> findByUserId(@Param("tourId") Long userId);
}
