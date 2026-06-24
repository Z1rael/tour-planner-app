package at.tourplanner.tour_planner.jwt;

import at.tourplanner.tour_planner.features.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private User user;

    // 64-byte base64 secret (for HS384)
    private static final String TEST_SECRET =
            "58d2454cb577a09fddcd51252ecc7f6a9e07ca415a65940c8e0585baa3fcf619";
    private static final long ONE_HOUR_MS = 3_600_000L;
    private static final long ONE_MS = 1L;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtService, "expiration", ONE_HOUR_MS);

        user = new User();
        user.setUserId(1L);
        user.setEmail("test@test.com");
        user.setPassword("hashed");
    }

    /* generateToken */
    @Test
    void generateToken_returnsNonNullToken() {
        String token = jwtService.generateToken(user);
        assertThat(token).isNotNull().isNotBlank();
    }

    @Test
    void generateToken_tokenHasThreeParts() {
        // header.payload.signature
        String token = jwtService.generateToken(user);
        assertThat(token.split("\\.")).hasSize(3);
    }

    /* extractUsername */
    @Test
    void extractUsername_returnsCorrectEmail() {
        String token = jwtService.generateToken(user);
        String extracted = jwtService.extractUsername(token);
        assertThat(extracted).isEqualTo("test@test.com");
    }

    @Test
    void extractUsername_differentUsers_returnCorrectEmails() {
        User other = new User();
        other.setEmail("other@test.com");
        other.setPassword("hashed");

        String token1 = jwtService.generateToken(user);
        String token2 = jwtService.generateToken(other);

        assertThat(jwtService.extractUsername(token1)).isEqualTo("test@test.com");
        assertThat(jwtService.extractUsername(token2)).isEqualTo("other@test.com");
    }

    /* isTokenExpired */
    @Test
    void isTokenExpired_freshToken_returnsFalse() {
        String token = jwtService.generateToken(user);
        assertThat(jwtService.isTokenExpired(token)).isFalse();
    }

    @Test
    void isTokenExpired_expiredToken_returnsTrue() throws InterruptedException {
        ReflectionTestUtils.setField(jwtService, "expiration", ONE_MS);
        String token = jwtService.generateToken(user);
        Thread.sleep(10);
        assertThatThrownBy(() -> jwtService.isTokenExpired(token))
                .isInstanceOf(io.jsonwebtoken.ExpiredJwtException.class);
    }

    /* isTokenValid */
    @Test
    void isTokenValid_correctUserAndFreshToken_returnsTrue() {
        String token = jwtService.generateToken(user);
        assertThat(jwtService.isTokenValid(token, user)).isTrue();
    }

    @Test
    void isTokenValid_wrongUser_returnsFalse() {
        User other = new User();
        other.setEmail("other@test.com");
        other.setPassword("hashed");

        String token = jwtService.generateToken(user);
        assertThat(jwtService.isTokenValid(token, other)).isFalse();
    }

    @Test
    void isTokenValid_expiredToken_returnsFalse() throws InterruptedException {
        ReflectionTestUtils.setField(jwtService, "expiration", ONE_MS);
        String token = jwtService.generateToken(user);
        Thread.sleep(10);
        assertThatThrownBy(() -> jwtService.isTokenValid(token, user))
                .isInstanceOf(io.jsonwebtoken.ExpiredJwtException.class);
    }
}