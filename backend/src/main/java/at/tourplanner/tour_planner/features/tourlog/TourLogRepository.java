package at.tourplanner.tour_planner.features.tourlog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourLogRepository extends JpaRepository<TourLog, Long> {

    // find tour logs of a specific tour
    @Query("SELECT tl FROM TourLog tl WHERE tl.tour.tourId = :tourId")
    List<TourLog> findByTourId(@Param("tourId") Long tourId);

    // find tour logs of a specific user
    @Query("SELECT tl FROM TourLog tl WHERE tl.user.userId = :userId")
    List<TourLog> findByUserId(@Param("tourId") Long userId);

    // find by id & user id
    @Query("SELECT tl FROM TourLog tl WHERE tl.tourLogId = :id AND tl.user.userId = :userId")
    Optional<TourLog> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
 
    // find by tour & user id
    @Query("SELECT tl FROM TourLog tl WHERE tl.tour.tourId = :tourId AND tl.user.userId = :userId")
    List<TourLog> findByTourIdAndUserId(@Param("tourId") Long tourId, @Param("userId") Long userId);
 
    // full search
    @Query("""
            SELECT tl FROM TourLog tl
            WHERE tl.user.userId = :userId
              AND (
                    LOWER(tl.comment) LIKE LOWER(CONCAT('%', :q, '%'))
                 OR CAST(tl.difficulty AS string)      LIKE CONCAT('%', :q, '%')
                 OR CAST(tl.rating AS string)          LIKE CONCAT('%', :q, '%')
                 OR CAST(tl.totalDistanceKm AS string) LIKE CONCAT('%', :q, '%')
                 OR CAST(tl.totalTimeS AS string)      LIKE CONCAT('%', :q, '%')
              )
            """)
    List<TourLog> searchByUserId(@Param("userId") Long userId, @Param("q") String query);

}
