package at.tourplanner.tour_planner.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "transportation_types")
@Data
public class TransportType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transportationTypeId;

    @Column(name = "transportation_name", nullable = false)
    private String transportationName;
}
