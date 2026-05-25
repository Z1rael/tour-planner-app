package at.tourplanner.tour_planner.ors.config;

import feign.RequestInterceptor;
import lombok.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OrsClientConfig {

    @Value("${ors.api-key}")
    private String apiKey;

    @Bean
    public RequestInterceptor orsApiKeyInterceptor() {
        return template -> template.header("Authorization", apiKey);
    }
}
