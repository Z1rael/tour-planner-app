package at.tourplanner.tour_planner.api.dto.tourlog;

import at.tourplanner.tour_planner.features.tourlog.TourLog;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TourLogResponse(
        Long tourLogId,
        Long tourId,
        String comment,
        Integer difficulty,
        Integer rating,
        Long totalTimeS,
        Long totalDistanceKm,
        LocalDateTime logDate
) {
    public static TourLogResponse from(TourLog log) {
        return new TourLogResponse(
                log.getTourLogId(),
                log.getTour().getTourId(),
                log.getComment(),
                log.getDifficulty(),
                log.getRating(),
                log.getTotalTimeS(),
                log.getTotalDistanceKm(),
                log.getLogDate()
        );
    }
}