package at.tourplanner.tour_planner.api.dto.tour;

import at.tourplanner.tour_planner.api.dto.geocode.GeocodeDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTourRequest(
        @NotBlank @Size(min = 3, max = 255)
        String name,
        String description,
        @JsonProperty("fromGeocode")
        @NotNull @Valid GeocodeDTO fromGeocode,
        @JsonProperty("toGeocode")
        @NotNull @Valid GeocodeDTO toGeocode,
        @NotNull  String profile    // "driving-car", "cycling-regular" etc.
) {
}
