package at.tourplanner.tour_planner.features.search;

import at.tourplanner.tour_planner.api.dto.search.SearchResponse;
import at.tourplanner.tour_planner.api.dto.tour.TourSummaryResponse;
import at.tourplanner.tour_planner.api.dto.tourlog.TourLogResponse;
import at.tourplanner.tour_planner.features.tour.Tour;
import at.tourplanner.tour_planner.features.tour.TourService;
import at.tourplanner.tour_planner.features.tourlog.TourLog;
import at.tourplanner.tour_planner.features.tourlog.TourLogService;
import at.tourplanner.tour_planner.features.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final TourService tourService;
    private final TourLogService tourLogService;

    @Transactional(readOnly = true)
    public SearchResponse search(String query, User user) {
        List<Tour> tours = tourService.searchTours(query, user);
        List<TourLog> logs = tourLogService.searchLogs(query, user);

        List<TourSummaryResponse> tourDtos = tours.stream()
                .map(t -> TourSummaryResponse.from(
                        t,
                        tourService.getPopularity(t),
                        tourService.getChildFriendliness(t)))
                .toList();

        List<TourLogResponse> logDtos = logs.stream()
                .map(TourLogResponse::from)
                .toList();

        return new SearchResponse(tourDtos, logDtos);
    }
}