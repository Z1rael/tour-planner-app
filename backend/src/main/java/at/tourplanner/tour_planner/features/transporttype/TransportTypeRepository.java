package at.tourplanner.tour_planner.features.transporttype;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransportTypeRepository extends JpaRepository<TransportType, Long> {
    Optional<TransportType> findByTransportationName(String name);
}
