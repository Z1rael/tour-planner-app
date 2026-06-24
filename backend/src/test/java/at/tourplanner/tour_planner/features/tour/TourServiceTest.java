package at.tourplanner.tour_planner.features.tour;

import at.tourplanner.tour_planner.features.tourlog.TourLog;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
 
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

public class TourServiceTest {
    private TourService tourService;

    @BeforeEach
    void setUp() {
        // initialize TourService with mock dependencies
        tourService = new TourService(null,null,null);
    }

    /* popularity */
    @Test
    void popularity_noLogs_returnsZero() {
        Tour tour = new Tour();
        // logs list is initialized as empty ArrayList in the entity
        assertThat(tourService.getPopularity(tour)).isZero();
    }

    @Test
    void popularity_oneLogs_returnsOne() {
        Tour tour = tourWithLogs(makeLog(2, 60, 5.0));
        assertThat(tourService.getPopularity(tour)).isEqualTo(1);
    }
 
    @Test
    void popularity_multipleLogs_returnsCount() {
        Tour tour = tourWithLogs(
                makeLog(1, 30, 3.0),
                makeLog(3, 90, 7.0),
                makeLog(5, 200, 20.0)
        );
        assertThat(tourService.getPopularity(tour)).isEqualTo(3);
    }

    /* child-friendliness */
    @Test
    void childFriendliness_noLogs_returnsZero() {
        // no logs -> unknown friendliness, documented as 0.0
        Tour tour = new Tour();
        assertThat(tourService.getChildFriendliness(tour)).isEqualTo(0.0);
    }
 
    @Test
    void childFriendliness_perfectConditions_returnsOne() {
        // difficulty=1, time<=60min, distance<=5km → all axes score 1.0
        Tour tour = tourWithLogs(makeLog(1, 60 * 60, 5.0)); // 60min in seconds, 5km
        double score = tourService.getChildFriendliness(tour);
        assertThat(score).isCloseTo(1.0, within(0.01));
    }
 
    @Test
    void childFriendliness_worstConditions_returnsLow() {
        // difficulty=5, time>=240min, distance>=30km → all axes score 0.0
        Tour tour = tourWithLogs(makeLog(5, 240 * 60, 30.0));
        double score = tourService.getChildFriendliness(tour);
        assertThat(score).isCloseTo(0.0, within(0.01));
    }
 
    @Test
    void childFriendliness_isAlwaysBetweenZeroAndOne() {
        // extreme values must stay in [0, 1] bc clamping
        Tour tour = tourWithLogs(makeLog(5, 999 * 60, 999.0));
        double score = tourService.getChildFriendliness(tour);
        assertThat(score).isBetween(0.0, 1.0);
    }
 
    @Test
    void childFriendliness_averagedAcrossMultipleLogs() {
        // 2 logs: one easy, one hard → should be mid-range
        Tour tour = tourWithLogs(
                makeLog(1, 30 * 60, 3.0),   // easy
                makeLog(5, 240 * 60, 30.0)  // hard
        );
        double score = tourService.getChildFriendliness(tour);
        assertThat(score).isBetween(0.1, 0.9);
    }
 
    @Test
    void childFriendliness_mediumDifficulty_returnsMidScore() {
        // difficulty=3, time=150min, distance=17.5km -> roughly middle
        Tour tour = tourWithLogs(makeLog(3, 150 * 60, 17.5));
        double score = tourService.getChildFriendliness(tour);
        assertThat(score).isBetween(0.3, 0.7);
    }
 
    @Test
    void childFriendliness_onlyDifficultyAffectsScore_whenTimeAndDistanceAreIdeal() {
        Tour easyTour = tourWithLogs(makeLog(1, 60 * 60, 5.0));
        Tour hardTour = tourWithLogs(makeLog(5, 60 * 60, 5.0));
        assertThat(tourService.getChildFriendliness(easyTour))
                .isGreaterThan(tourService.getChildFriendliness(hardTour));
    }

    /* helpers */
    private Tour tourWithLogs(TourLog... logs) {
            Tour tour = new Tour();
            tour.getLogs().addAll(List.of(logs));
            return tour;
        }
    
    private TourLog makeLog(int difficulty, long totalTimeS, double distanceKm) {
            TourLog log = new TourLog();
            log.setDifficulty(difficulty);
            log.setTotalTimeS(totalTimeS);
            log.setTotalDistanceKm(BigDecimal.valueOf(distanceKm));
            log.setRating(3);
            log.setComment("test");
            return log;
    }
}

