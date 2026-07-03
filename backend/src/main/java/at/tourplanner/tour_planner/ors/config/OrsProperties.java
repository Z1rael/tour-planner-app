package at.tourplanner.tour_planner.ors.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ors")
@Getter
@Setter
public class OrsProperties {
    private String url;
    private String apiKey;
}
