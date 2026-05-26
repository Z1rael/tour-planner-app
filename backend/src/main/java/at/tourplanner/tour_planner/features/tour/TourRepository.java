package at.tourplanner.tour_planner.features.tour;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    // find tours of a specific user
    @Query("SELECT t FROM Tour t WHERE t.user.userId = :userId")
    List<Tour> findByUserId(@Param("userId") Long userId);

    // find tours with a specific transport type
    @Query("SELECT t FROM Tour t WHERE t.transportType.transportationTypeId = :transportTypeId")
    List<Tour> findByTransportTypeId(@Param("transportTypeId") Long transportTypeId);
}
