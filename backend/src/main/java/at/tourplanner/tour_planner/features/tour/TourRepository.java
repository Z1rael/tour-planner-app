package at.tourplanner.tour_planner.features.tour;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    
    List<Tour> findByUserUserId(Long userId);

    Optional<Tour> findByTourIdAndUserUserId(Long tourId, Long userId);

    // find tours of a specific user
    @Query("SELECT t FROM Tour t WHERE t.user.userId = :userId")
    List<Tour> findByUserId(@Param("userId") Long userId);

    // find tours with a specific transport type
    @Query("SELECT t FROM Tour t WHERE t.transportType.transportationTypeId = :transportTypeId")
    List<Tour> findByTransportTypeId(@Param("transportTypeId") Long transportTypeId);

    //full-text search across name, description, transport type
    //also considers computed popularity (via log count) as a string match
    @Query("""
        SELECT DISTINCT t FROM Tour t
        LEFT JOIN t.logs l
        LEFT JOIN t.transportType tt
        WHERE t.user.userId = :userId
          AND (
            LOWER(t.name)        LIKE LOWER(CONCAT('%',:q,'%')) OR
            LOWER(t.description) LIKE LOWER(CONCAT('%',:q,'%')) OR
            LOWER(tt.transportationName) LIKE LOWER(CONCAT('%',:q,'%'))
          )
        """)
    List<Tour> searchByUserId(@Param("userId") Long userId, @Param("q") String query);
}
