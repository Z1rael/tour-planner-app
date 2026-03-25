package at.tourplanner.tour_planner.persistence.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Entity
@Table(name = "tour_logs")
@Data
public class TourLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tourLogId;

    @ManyToOne
    @JoinColumn(name = "tour_id", updatable = false)
    private Tour tour;

    @ManyToOne
    @JoinColumn(name = "user_id", updatable = false)
    private User user;

    private LocalDateTime logDate;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Min(value = 1, message = "Difficulty must be at least 1")
    @Max(value = 5, message = "Difficulty must be at maximum 5")
    private Integer difficulty;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at maximum 5")
    private Integer rating;

    private Long totalTime;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalDistance;
}
