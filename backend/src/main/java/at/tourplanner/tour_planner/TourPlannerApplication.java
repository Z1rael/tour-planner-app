package at.tourplanner.tour_planner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class TourPlannerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TourPlannerApplication.class, args);
	}

}
