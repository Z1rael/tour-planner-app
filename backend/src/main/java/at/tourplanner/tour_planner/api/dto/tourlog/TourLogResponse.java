package at.tourplanner.tour_planner.api.dto.tourlog;

import at.tourplanner.tour_planner.features.tourlog.TourLog;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TourLogResponse(
        Long logId,
        Long tourId,
        LocalDateTime logDate,
        String comment,
        Integer difficulty,
        Integer rating,
        Long totalTimeS,
        BigDecimal totalDistanceKm
) {
    public static TourLogResponse from(TourLog log) {
        return new TourLogResponse(
                log.getTourLogId(),
                log.getTour().getTourId(),
                log.getLogDate(),
                log.getComment(),
                log.getDifficulty(),
                log.getRating(),
                log.getTotalTimeS(),
                log.getTotalDistanceKm()
        );
    }
}