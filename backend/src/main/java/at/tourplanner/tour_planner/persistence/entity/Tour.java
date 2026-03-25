package at.tourplanner.tour_planner.persistence.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tours")
@Data
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tourId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String tourName;

    @Column(columnDefinition = "TEXT")
    private String tourDescription;

    private String fromLocation;
    private String toLocation;

    @ManyToOne
    @JoinColumn(name = "transportation_type_id")
    private TransportType transportType;

    @Column(precision = 10, scale = 2)
    private BigDecimal tourDistance;

    @Column(columnDefinition = "TEXT")
    private String tourInformation;

    private String imagePath;

    private Long estimatedTime;
}
