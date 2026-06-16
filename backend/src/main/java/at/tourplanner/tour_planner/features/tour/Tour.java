package at.tourplanner.tour_planner.features.tour;

import java.util.ArrayList;
import java.util.List;

import at.tourplanner.tour_planner.features.tourlog.TourLog;
import at.tourplanner.tour_planner.features.transporttype.TransportType;
import at.tourplanner.tour_planner.features.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.locationtech.jts.geom.LineString;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "tours")
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="tour_id")
    private Long tourId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull(message = "Tour name cannot be empty")
    @NotBlank(message = "Tour name cannot be blank")
    @Size(min = 3, max = 255)
    @Column(name = "tour_name", nullable = false)
    private String name;

    @Column(name = "tour_description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transport_type_id")
    private TransportType transportType;

    @Column(name = "tour_distance")
    private Double distanceKm;

    @Column(name = "route_information", nullable = false, columnDefinition = "GEOMETRY(LINESTRING, 4326)")
    private LineString route;

    @Size(max = 1000)
    private String imagePath;

    @Min(value = 0, message = "Time cannot be less than 0")
    @Column(name = "estimated_time")
    private Long estimatedTimeS;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourLog> logs = new ArrayList<>();
}
