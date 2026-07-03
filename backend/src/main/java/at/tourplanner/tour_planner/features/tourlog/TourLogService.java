package at.tourplanner.tour_planner.features.tourlog;

import at.tourplanner.tour_planner.api.dto.tourlog.CreateTourLogRequest;
import at.tourplanner.tour_planner.api.dto.tourlog.UpdateTourLogRequest;
import at.tourplanner.tour_planner.features.tour.Tour;
import at.tourplanner.tour_planner.features.tour.TourRepository;
import at.tourplanner.tour_planner.features.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TourLogService {

    private final TourLogRepository tourLogRepository;
    private final TourRepository tourRepository;

    @Transactional
    public TourLog createLog(CreateTourLogRequest request, User user) {
        Tour tour = tourRepository.findByIdAndUserId(request.tourId(), user.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Tour not found: " + request.tourId()));

        TourLog log = new TourLog();
        log.setTour(tour);
        log.setUser(user);
        log.setComment(request.comment());
        log.setDifficulty(request.difficulty());
        log.setRating(request.rating());
        log.setTotalTimeS(request.totalTimeS());
        log.setTotalDistanceKm(request.totalDistanceKm());
        log.setLogDate(LocalDateTime.now());

        tourLogRepository.save(log);
        log.toString(); 
        log.setLogDate(log.getLogDate()); 
        return log;
    }

    @Transactional(readOnly = true)
    public List<TourLog> getAllLogsForUser(User user) {
        return tourLogRepository.findByUserId(user.getUserId());
    }

    @Transactional(readOnly = true)
    public List<TourLog> getLogsForTour(Long tourId, User user) {
        return tourLogRepository.findByTourIdAndUserId(tourId, user.getUserId());
    }

    @Transactional(readOnly = true)
    public TourLog getLog(Long logId, User user) {
        return tourLogRepository.findByIdAndUserId(logId, user.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Log not found: " + logId));
    }

    @Transactional
    public TourLog updateLog(Long logId, UpdateTourLogRequest request, User user) {
        TourLog tourLog = getLog(logId, user);

        if (request.comment() != null)         tourLog.setComment(request.comment());
        if (request.difficulty() != null)      tourLog.setDifficulty(request.difficulty());
        if (request.rating() != null)          tourLog.setRating(request.rating());
        if (request.totalTimeS() != null)      tourLog.setTotalTimeS(request.totalTimeS());
        if (request.totalDistanceKm() != null) tourLog.setTotalDistanceKm(request.totalDistanceKm());

        return tourLogRepository.save(tourLog);
    }

    @Transactional
    public void deleteLog(Long logId, User user) {
        TourLog tourLog = getLog(logId, user);
        tourLogRepository.delete(tourLog);
        log.info("Deleted tour log [{}]", logId);
    }

    @Transactional(readOnly = true)
    public List<TourLog> searchLogs(String query, User user) {
        return tourLogRepository.searchByUserId(user.getUserId(), query);
    }
}