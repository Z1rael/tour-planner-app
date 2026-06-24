package at.tourplanner.tour_planner.features.tourlog;

import at.tourplanner.tour_planner.api.dto.tourlog.CreateTourLogRequest;
import at.tourplanner.tour_planner.api.dto.tourlog.UpdateTourLogRequest;
import at.tourplanner.tour_planner.features.tour.Tour;
import at.tourplanner.tour_planner.features.tour.TourRepository;
import at.tourplanner.tour_planner.features.user.User;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TourLogServiceTest {

    @Mock
    private TourLogRepository tourLogRepository;

    @Mock
    private TourRepository tourRepository;

    @InjectMocks
    private TourLogService tourLogService;

    private User user;
    private Tour tour;
    private TourLog existingLog;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUserId(1L);
        user.setEmail("test@test.com");
        user.setPassword("hashed");

        tour = new Tour();
        tour.setTourId(10L);
        tour.setUser(user);
        tour.setName("Test Tour");

        existingLog = new TourLog();
        existingLog.setTourLogId(100L);
        existingLog.setTour(tour);
        existingLog.setUser(user);
        existingLog.setComment("Original comment");
        existingLog.setDifficulty(3);
        existingLog.setRating(4);
        existingLog.setTotalTimeS(3600L);
        existingLog.setTotalDistanceKm(BigDecimal.valueOf(10.0));
    }

    /* createLog */
    @Test
    void createLog_validRequest_savesAndReturnsLog() {
        CreateTourLogRequest request = new CreateTourLogRequest(
                10L, "Great hike!", 2, 5, 7200L, BigDecimal.valueOf(15.0)
        );
        when(tourRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(tour));
        when(tourLogRepository.save(any(TourLog.class))).thenAnswer(i -> i.getArgument(0));

        TourLog result = tourLogService.createLog(request, user);

        assertThat(result.getComment()).isEqualTo("Great hike!");
        assertThat(result.getDifficulty()).isEqualTo(2);
        assertThat(result.getRating()).isEqualTo(5);
        assertThat(result.getTour()).isEqualTo(tour);
        assertThat(result.getUser()).isEqualTo(user);
        assertThat(result.getLogDate()).isNotNull();
        verify(tourLogRepository).save(any(TourLog.class));
    }

    @Test
    void createLog_tourNotFound_throwsEntityNotFoundException() {
        CreateTourLogRequest request = new CreateTourLogRequest(
                99L, "comment", 1, 1, 100L, BigDecimal.ONE
        );
        when(tourRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tourLogService.createLog(request, user))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");

        verify(tourLogRepository, never()).save(any());
    }

    @Test
    void createLog_tourBelongingToOtherUser_throwsEntityNotFoundException() {
        // findByIdAndUserId already filters by userId, so empty = access denied
        CreateTourLogRequest request = new CreateTourLogRequest(
                10L, "comment", 1, 1, 100L, BigDecimal.ONE
        );
        when(tourRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tourLogService.createLog(request, user))
                .isInstanceOf(EntityNotFoundException.class);
    }

    /* getLog */
    @Test
    void getLog_existingLog_returnsLog() {
        when(tourLogRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(existingLog));

        TourLog result = tourLogService.getLog(100L, user);

        assertThat(result).isEqualTo(existingLog);
    }

    @Test
    void getLog_notFound_throwsEntityNotFoundException() {
        when(tourLogRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tourLogService.getLog(999L, user))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("999");
    }

    /* updateLog */
    @Test
    void updateLog_allFieldsProvided_updatesAllFields() {
        UpdateTourLogRequest request = new UpdateTourLogRequest(
                "Updated comment", 5, 2, 1800L, BigDecimal.valueOf(5.0)
        );
        when(tourLogRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(existingLog));
        when(tourLogRepository.save(existingLog)).thenReturn(existingLog);

        TourLog result = tourLogService.updateLog(100L, request, user);

        assertThat(result.getComment()).isEqualTo("Updated comment");
        assertThat(result.getDifficulty()).isEqualTo(5);
        assertThat(result.getRating()).isEqualTo(2);
        assertThat(result.getTotalTimeS()).isEqualTo(1800L);
        assertThat(result.getTotalDistanceKm()).isEqualByComparingTo(BigDecimal.valueOf(5.0));
    }

    @Test
    void updateLog_nullFields_doesNotOverwriteExistingValues() {
        // partial update — null fields must be ignored
        UpdateTourLogRequest request = new UpdateTourLogRequest(
                "New comment", null, null, null, null
        );
        when(tourLogRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(existingLog));
        when(tourLogRepository.save(existingLog)).thenReturn(existingLog);

        TourLog result = tourLogService.updateLog(100L, request, user);

        assertThat(result.getComment()).isEqualTo("New comment");
        assertThat(result.getDifficulty()).isEqualTo(3);   // unchanged
        assertThat(result.getRating()).isEqualTo(4);        // unchanged
        assertThat(result.getTotalTimeS()).isEqualTo(3600L); // unchanged
    }

    @Test
    void updateLog_logNotFound_throwsEntityNotFoundException() {
        UpdateTourLogRequest request = new UpdateTourLogRequest("x", 1, 1, 1L, BigDecimal.ONE);
        when(tourLogRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tourLogService.updateLog(999L, request, user))
                .isInstanceOf(EntityNotFoundException.class);

        verify(tourLogRepository, never()).save(any());
    }

    /* deleteLog */
    @Test
    void deleteLog_existingLog_deletesSuccessfully() {
        when(tourLogRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(existingLog));

        tourLogService.deleteLog(100L, user);

        verify(tourLogRepository).delete(existingLog);
    }

    @Test
    void deleteLog_notFound_throwsAndDoesNotDelete() {
        when(tourLogRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tourLogService.deleteLog(999L, user))
                .isInstanceOf(EntityNotFoundException.class);

        verify(tourLogRepository, never()).delete(any());
    }

    /* getLogsForTour */
    @Test
    void getLogsForTour_returnsOnlyUserLogs() {
        when(tourLogRepository.findByTourIdAndUserId(10L, 1L)).thenReturn(List.of(existingLog));

        List<TourLog> result = tourLogService.getLogsForTour(10L, user);

        assertThat(result).hasSize(1).contains(existingLog);
    }

    @Test
    void getLogsForTour_noLogs_returnsEmptyList() {
        when(tourLogRepository.findByTourIdAndUserId(10L, 1L)).thenReturn(List.of());

        List<TourLog> result = tourLogService.getLogsForTour(10L, user);

        assertThat(result).isEmpty();
    }

    /* searchLogs */
    @Test
    void searchLogs_delegatesToRepository() {
        when(tourLogRepository.searchByUserId(1L, "alpine")).thenReturn(List.of(existingLog));

        List<TourLog> result = tourLogService.searchLogs("alpine", user);

        assertThat(result).containsExactly(existingLog);
        verify(tourLogRepository).searchByUserId(1L, "alpine");
    }
}