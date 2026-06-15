package at.tourplanner.tour_planner.features.tourlog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourLogRepository extends JpaRepository<TourLog, Long> {

    List<TourLog> findByTourTourId(Long tourId);

    Optional<TourLog> findByTourTourIdAndTourLogId(Long tourId, Long logId);
    
    @Query("""
        SELECT l FROM TourLog l
        WHERE l.tour.tourId = :tourId
          AND l.tour.user.userId = :userId
          AND (
            LOWER(l.comment) LIKE LOWER(CONCAT('%',:q,'%')) OR
            CAST(l.difficulty AS string) LIKE CONCAT('%',:q,'%') OR
            CAST(l.rating AS string) LIKE CONCAT('%',:q,'%')
          )
        """)
    List<TourLog> searchInTour(
            @Param("tourId") Long tourId,
            @Param("userId") Long userId,
            @Param("q") String query);

    // find tour logs of a specific tour
    @Query("SELECT tl FROM TourLog tl WHERE tl.tour.tourId = :tourId")
    List<TourLog> findByTourId(@Param("tourId") Long tourId);

    // find tour logs of a specific user
    @Query("SELECT tl FROM TourLog tl WHERE tl.user.userId = :userId")
    List<TourLog> findByUserId(@Param("tourId") Long userId);
}
