package at.tourplanner.tour_planner.features.tourlog;

import at.tourplanner.tour_planner.api.dto.tourlog.CreateTourLogRequest;
import at.tourplanner.tour_planner.api.dto.tourlog.TourLogResponse;
import at.tourplanner.tour_planner.api.dto.tourlog.UpdateTourLogRequest;
import at.tourplanner.tour_planner.features.tour.Tour;
import at.tourplanner.tour_planner.features.tour.TourRepository;
import at.tourplanner.tour_planner.features.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourLogService {

    private final TourLogRepository tourLogRepository;
    private final TourRepository tourRepository;

    @Transactional(readOnly = true)
    public List<TourLogResponse> getLogs(Long tourId, User user) {
        verifyTourOwnership(tourId, user);
        return tourLogRepository.findByTourTourId(tourId)
                .stream().map(TourLogResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TourLogResponse getLog(Long tourId, Long logId, User user) {
        verifyTourOwnership(tourId, user);
        return TourLogResponse.from(findLogOrThrow(tourId, logId));
    }

    @Transactional
    public TourLogResponse createLog(Long tourId, CreateTourLogRequest req, User user) {
        Tour tour = verifyTourOwnership(tourId, user);
        TourLog log = new TourLog();
        log.setTour(tour);
        log.setUser(user);
        log.setLogDate(req.logDate());
        log.setComment(req.comment());
        log.setDifficulty(req.difficulty());
        log.setRating(req.rating());
        log.setTotalTimeS(req.totalTimeS());
        log.setTotalDistanceKm(req.totalDistanceKm());
        return TourLogResponse.from(tourLogRepository.save(log));
    }

    @Transactional
    public TourLogResponse updateLog(Long tourId, Long logId, UpdateTourLogRequest req, User user) {
        verifyTourOwnership(tourId, user);
        TourLog log = findLogOrThrow(tourId, logId);
        if (req.logDate() != null)         log.setLogDate(req.logDate());
        if (req.comment() != null)         log.setComment(req.comment());
        if (req.difficulty() != null)      log.setDifficulty(req.difficulty());
        if (req.rating() != null)          log.setRating(req.rating());
        if (req.totalTimeS() != null)      log.setTotalTimeS(req.totalTimeS());
        if (req.totalDistanceKm() != null) log.setTotalDistanceKm(req.totalDistanceKm());
        return TourLogResponse.from(tourLogRepository.save(log));
    }

    @Transactional
    public void deleteLog(Long tourId, Long logId, User user) {
        verifyTourOwnership(tourId, user);
        TourLog log = findLogOrThrow(tourId, logId);
        tourLogRepository.delete(log);
    }

    @Transactional(readOnly = true)
    public List<TourLogResponse> search(Long tourId, String query, User user) {
        verifyTourOwnership(tourId, user);
        return tourLogRepository.searchInTour(tourId, user.getUserId(), query)
                .stream().map(TourLogResponse::from).toList();
    }

    private Tour verifyTourOwnership(Long tourId, User user) {
        return tourRepository.findByTourIdAndUserUserId(tourId, user.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tour not found"));
    }

    private TourLog findLogOrThrow(Long tourId, Long logId) {
        return tourLogRepository.findByTourLogIdAndTourTourId(logId, tourId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Log not found"));
    }
}