package toanweb2.DoAnWeb2.config;

import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import toanweb2.DoAnWeb2.security.CustomUserDetailsService;
import toanweb2.DoAnWeb2.security.JwtAuthenticationFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow FORWARD and ERROR dispatches (required for Spring Boot 4 / Spring Security 7)
                .dispatcherTypeMatchers(DispatcherType.FORWARD, DispatcherType.ERROR).permitAll()

                // Public - Giao diện và tài nguyên tĩnh
                .requestMatchers("/", "/index.html", "/css/**", "/js/**", "/images/**", "/favicon.ico", "/assets/**", "/static/**", "/uploads/**").permitAll()

                // Public - Đăng nhập, đăng ký, VNPay callback
                .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/forgot-password", "/api/vnpay/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public - Xem dịch vụ, danh mục, đánh giá, khuyến mãi, banners (GET only)
                .requestMatchers(HttpMethod.GET, "/api/spa-services/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/service-categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reviews/service/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reviews/appointment/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/promotions/active").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/promotions/check/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/promotions/code/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/promotions/service/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/banners/**").permitAll()

                // Upload files
                .requestMatchers(HttpMethod.POST, "/api/upload").authenticated()

                // 1. Users
                .requestMatchers(HttpMethod.PUT, "/api/users/{id}/change-password").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/users/{id}").authenticated()
                .requestMatchers("/api/users/**").hasRole("ADMIN")

                // 2. Employees
                .requestMatchers(HttpMethod.GET, "/api/employees").hasAnyRole("ADMIN", "NHAN_VIEN", "KHACH_HANG", "CUSTOMER")
                .requestMatchers(HttpMethod.GET, "/api/employees/{id}").hasAnyRole("ADMIN", "NHAN_VIEN", "KHACH_HANG", "CUSTOMER")
                .requestMatchers(HttpMethod.GET, "/api/employees/status/{status}").hasAnyRole("ADMIN", "NHAN_VIEN", "KHACH_HANG", "CUSTOMER")
                .requestMatchers("/api/employees/**").hasRole("ADMIN")

                // 3. Customers
                .requestMatchers("/api/customers/type/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/customers/**").hasRole("ADMIN")
                .requestMatchers("/api/customers/**").hasAnyRole("ADMIN", "NHAN_VIEN", "KHACH_HANG", "CUSTOMER")

                // 4. Appointments
                .requestMatchers(HttpMethod.DELETE, "/api/appointments/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/appointments/{id}/status").hasAnyRole("ADMIN", "NHAN_VIEN", "KHACH_HANG", "CUSTOMER")
                .requestMatchers(HttpMethod.GET, "/api/appointments/customer/{customerId}").hasAnyRole("ADMIN", "NHAN_VIEN", "KHACH_HANG", "CUSTOMER")
                .requestMatchers(HttpMethod.GET, "/api/appointments/{id}").hasAnyRole("ADMIN", "NHAN_VIEN", "KHACH_HANG", "CUSTOMER")
                .requestMatchers(HttpMethod.POST, "/api/appointments").hasAnyRole("ADMIN", "NHAN_VIEN", "KHACH_HANG", "CUSTOMER")
                .requestMatchers("/api/appointments/**").hasAnyRole("ADMIN", "NHAN_VIEN")

                // 5. Invoices
                .requestMatchers("/api/invoices/revenue/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/invoices/{id}/payment").hasAnyRole("ADMIN", "NHAN_VIEN", "KHACH_HANG", "CUSTOMER")
                .requestMatchers(HttpMethod.GET, "/api/invoices/customer/{customerId}").hasAnyRole("ADMIN", "NHAN_VIEN", "KHACH_HANG", "CUSTOMER")
                .requestMatchers(HttpMethod.GET, "/api/invoices/{id}").hasAnyRole("ADMIN", "NHAN_VIEN", "KHACH_HANG", "CUSTOMER")
                .requestMatchers("/api/invoices/**").hasAnyRole("ADMIN", "NHAN_VIEN")

                // 6. Dashboard Stats
                .requestMatchers("/api/dashboard/**").hasAnyRole("ADMIN", "NHAN_VIEN")

                // 7. Spa Services & Service Categories
                .requestMatchers(HttpMethod.POST, "/api/spa-services").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/spa-services/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/spa-services/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/service-categories").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/service-categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/service-categories/**").hasRole("ADMIN")

                // 8. Promotions
                .requestMatchers(HttpMethod.POST, "/api/promotions").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/promotions/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/promotions/**").hasRole("ADMIN")
                .requestMatchers("/api/promotions/**").hasAnyRole("ADMIN", "NHAN_VIEN")

                // 9. Reviews
                .requestMatchers(HttpMethod.POST, "/api/reviews").hasAnyRole("KHACH_HANG", "CUSTOMER")
                .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").hasRole("ADMIN")
                .requestMatchers("/api/reviews/**").hasAnyRole("ADMIN", "NHAN_VIEN")

                // 10. Rooms
                .requestMatchers(HttpMethod.POST, "/api/rooms").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/rooms/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/rooms/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/rooms/status/{status}").hasAnyRole("ADMIN", "NHAN_VIEN", "KHACH_HANG", "CUSTOMER")
                .requestMatchers("/api/rooms/**").hasAnyRole("ADMIN", "NHAN_VIEN")

                // 11. Banners
                .requestMatchers(HttpMethod.POST, "/api/banners").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/banners/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/banners/**").hasRole("ADMIN")

                // Tất cả endpoint khác cần đăng nhập
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    System.out.println(">>> ACCESS DENIED for " + request.getMethod() + " " + request.getRequestURI());
                    System.out.println(">>> User: " + (request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : "ANONYMOUS"));
                    System.out.println(">>> Exception: " + accessDeniedException.getMessage());
                    response.setStatus(403);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Access Denied\",\"message\":\"" + accessDeniedException.getMessage() + "\",\"path\":\"" + request.getRequestURI() + "\"}");
                })
                .authenticationEntryPoint((request, response, authException) -> {
                    System.out.println(">>> UNAUTHORIZED for " + request.getMethod() + " " + request.getRequestURI());
                    System.out.println(">>> Exception: " + authException.getMessage());
                    response.setStatus(401);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"" + authException.getMessage() + "\"}");
                })
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
