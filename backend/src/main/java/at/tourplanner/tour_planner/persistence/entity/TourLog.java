package at.tourplanner.tour_planner.persistence.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "tour_logs")
public class TourLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tourLogId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", updatable = false)
    private Tour tour;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", updatable = false)
    private User user;

    private LocalDateTime logDate;

    @Lob
    private String comment;

    @Min(value = 1, message = "Difficulty must be at least 1")
    @Max(value = 5, message = "Difficulty must be at maximum 5")
    @Column(columnDefinition = "SMALLINT")
    private Integer difficulty;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at maximum 5")
    @Column(columnDefinition = "SMALLINT")
    private Integer rating;

    @Min(value = 0, message = "Time cannot be less than 0")
    @Column(name = "total_time")
    private Long totalTime;

    @Column(name = "total_distance", precision = 10, scale = 2)
    private BigDecimal totalDistance;
}
