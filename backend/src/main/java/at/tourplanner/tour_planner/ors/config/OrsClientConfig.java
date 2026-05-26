package at.tourplanner.tour_planner.ors.config;

import feign.Logger;
import feign.RequestInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class OrsClientConfig {

    private final OrsProperties orsProperties;

    @Bean
    public RequestInterceptor orsApiKeyInterceptor() {
        return template -> template.header("Authorization", orsProperties.getApiKey());
    }

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}
