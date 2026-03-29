package at.tourplanner.tour_planner.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "transportation_types")
public class TransportType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transportationTypeId;

    @NotBlank
    @Size(max = 255)
    @Column(name = "transportation_name", nullable = false)
    private String transportationName;
}
