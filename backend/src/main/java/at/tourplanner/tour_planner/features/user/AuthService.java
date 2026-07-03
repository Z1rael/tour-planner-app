package at.tourplanner.tour_planner.features.user;

import at.tourplanner.tour_planner.api.dto.auth.AuthResponse;
import at.tourplanner.tour_planner.api.dto.auth.LoginRequest;
import at.tourplanner.tour_planner.api.dto.auth.RegisterRequest;
import at.tourplanner.tour_planner.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        if (!request.password().equals(request.passwordRepeat())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user  = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        return new AuthResponse(jwtService.generateToken(user));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow();

        return new AuthResponse(jwtService.generateToken(user));
    }


}
