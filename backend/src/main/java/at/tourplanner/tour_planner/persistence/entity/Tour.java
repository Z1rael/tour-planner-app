package at.tourplanner.tour_planner.persistence.entity;

import java.lang.System.Logger.Level;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
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

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "tours")
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tourId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull(message = "Tour name cannot be empty")
    @NotBlank(message = "Tour name cannot be blank")
    @Size(min = 3, max = 255)
    @Column(nullable = false)
    private String tourName;

    @Lob
    private String tourDescription;

    private Double fromLatitude;
    private Double fromLongitude;

    private Double toLatitude;
    private Double toLongitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transportation_type_id")
    private TransportType transportType;

    @Column(precision = 10, scale = 2)
    private BigDecimal tourDistance;

    @Lob
    private String tourInformation;

    @Size(max = 1000)
    private String imagePath;

    @Min(value = 0, message = "Time cannot be less than 0")
    private Long estimatedTime;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tour> tours = new ArrayList<>();

}
