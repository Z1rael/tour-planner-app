package at.tourplanner.tour_planner.api.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8) String password,
        @JsonProperty("passwordRepeat")
        @NotBlank @Size(min = 8) String passwordRepeat
) {
}
