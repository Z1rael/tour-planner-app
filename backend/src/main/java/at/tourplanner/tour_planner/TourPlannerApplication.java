package at.tourplanner.tour_planner;

import java.util.Scanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TourPlannerApplication {

	public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);

		System.out.print("Enter name: ");
		String name = scanner.next();
		System.out.printf("\nHello, %s", name);

		SpringApplication.run(TourPlannerApplication.class, args);

		scanner.close();
	}

}
