package at.tourplanner.tour_planner.features.user;

import at.tourplanner.tour_planner.api.dto.auth.AuthResponse;
import at.tourplanner.tour_planner.api.dto.auth.LoginRequest;
import at.tourplanner.tour_planner.api.dto.auth.RegisterRequest;
import at.tourplanner.tour_planner.jwt.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User savedUser;

    @BeforeEach
    void setUp() {
        savedUser = new User();
        savedUser.setUserId(1L);
        savedUser.setEmail("test@test.com");
        savedUser.setPassword("$2a$hashed");
    }

    /* register */
    @Test
    void register_validRequest_returnsToken() {
        RegisterRequest request = new RegisterRequest("new@test.com", "password123", "password123");
        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$hashed");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(any(User.class))).thenReturn("mock-token");

        AuthResponse response = authService.register(request);

        assertThat(response.token()).isEqualTo("mock-token");
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("password123");
    }

    @Test
    void register_emailAlreadyExists_throwsIllegalArgumentException() {
        RegisterRequest request = new RegisterRequest("test@test.com", "password123", "password123");
        when(userRepository.existsByEmail("test@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email already exists");

        verify(userRepository, never()).save(any());
    }

    @Test
    void register_passwordsDoNotMatch_throwsIllegalArgumentException() {
        RegisterRequest request = new RegisterRequest("new@test.com", "password123", "different456");
        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Passwords do not match");

        verify(userRepository, never()).save(any());
    }

    @Test
    void register_passwordIsEncoded_rawPasswordNotStored() {
        RegisterRequest request = new RegisterRequest("new@test.com", "password123", "password123");
        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$hashed");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            // raw password can never be stored
            assertThat(u.getPassword()).isNotEqualTo("password123");
            return savedUser;
        });
        when(jwtService.generateToken(any())).thenReturn("token");

        authService.register(request);

        verify(passwordEncoder).encode("password123");
    }

    /* login */
    @Test
    void login_validCredentials_returnsToken() {
        LoginRequest request = new LoginRequest("test@test.com", "password123");
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(savedUser));
        when(jwtService.generateToken(savedUser)).thenReturn("mock-token");

        AuthResponse response = authService.login(request);

        assertThat(response.token()).isEqualTo("mock-token");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_invalidCredentials_throwsException() {
        LoginRequest request = new LoginRequest("test@test.com", "wrongpassword");
        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager).authenticate(any());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);

        verify(jwtService, never()).generateToken(any());
    }

    @Test
    void login_authenticatesWithCorrectEmailAndPassword() {
        LoginRequest request = new LoginRequest("test@test.com", "password123");
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(savedUser));
        when(jwtService.generateToken(any())).thenReturn("token");

        authService.login(request);

        verify(authenticationManager).authenticate(
                argThat(auth -> {
                    UsernamePasswordAuthenticationToken token =
                            (UsernamePasswordAuthenticationToken) auth;
                    return token.getPrincipal().equals("test@test.com")
                            && token.getCredentials().equals("password123");
                })
        );
    }
}