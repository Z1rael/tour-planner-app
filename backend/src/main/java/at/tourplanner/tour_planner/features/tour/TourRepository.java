package at.tourplanner.tour_planner.features.tour;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    // find tours of a specific user
    @Query("SELECT t FROM Tour t WHERE t.user.userId = :userId")
    List<Tour> findByUserId(@Param("userId") Long userId);

    // find tours with a specific transport type
    @Query("SELECT t FROM Tour t WHERE t.transportType.transportationTypeId = :transportTypeId")
    List<Tour> findByTransportTypeId(@Param("transportTypeId") Long transportTypeId);

    // find by tour & user id
    @Query("SELECT t FROM Tour t WHERE t.user.userId = :userId AND t.tourId = :tourId")
    Optional<Tour> findByIdAndUserId(@Param("tourId") Long tourId, @Param("userId") Long userId);
 
    // full-text search
        @Query("""
            SELECT t FROM Tour t
            LEFT JOIN t.transportType tt
            WHERE (
                    LOWER(t.name)                    LIKE LOWER(CONCAT('%', :q, '%'))
                 OR LOWER(t.description)             LIKE LOWER(CONCAT('%', :q, '%'))
                 OR LOWER(t.fromAddress)             LIKE LOWER(CONCAT('%', :q, '%'))
                 OR LOWER(t.toAddress)               LIKE LOWER(CONCAT('%', :q, '%'))
                 OR LOWER(tt.transportationName)     LIKE LOWER(CONCAT('%', :q, '%'))
                 OR CAST(t.distanceKm AS string)     LIKE CONCAT('%', :q, '%')
                 OR CAST(t.estimatedTimeS AS string) LIKE CONCAT('%', :q, '%')
              )
            """)
    List<Tour> searchByUserId(@Param("userId") Long userId, @Param("q") String query);

}
