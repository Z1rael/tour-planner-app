package at.tourplanner.tour_planner.persistence.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @NotNull(message = "Username cannot be empty")
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must eb between 3 and 50 characters")
    private String username;

    @Email(message = "Please provide a valid email")
    @Size(max = 255)
    @Column(unique = true, nullable = false)
    private String email;

    @NotNull(message = "Hash cannot be empty")
    @NotBlank(message = "Hash cannot be blank")
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tour> tours = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourLog> tourLogs = new ArrayList<>();
}
