package at.tourplanner.tour_planner.features.search;

import at.tourplanner.tour_planner.api.dto.search.SearchResponse;
import at.tourplanner.tour_planner.features.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    // GET /api/search?q=vienna -> returns matching tours & logs for the authenticated user.
    @GetMapping
    public ResponseEntity<SearchResponse> search(
            @RequestParam String q,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(searchService.search(q, user));
    }
}