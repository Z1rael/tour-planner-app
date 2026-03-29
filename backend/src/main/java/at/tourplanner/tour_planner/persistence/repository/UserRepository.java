package at.tourplanner.tour_planner.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import at.tourplanner.tour_planner.persistence.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
