package toanweb2.DoAnWeb2.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import toanweb2.DoAnWeb2.entity.Customer;
import toanweb2.DoAnWeb2.entity.Role;
import toanweb2.DoAnWeb2.entity.User;
import toanweb2.DoAnWeb2.repository.CustomerRepository;
import toanweb2.DoAnWeb2.repository.RoleRepository;
import toanweb2.DoAnWeb2.security.JwtTokenProvider;
import toanweb2.DoAnWeb2.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

        private final UserService userService;
        private final RoleRepository roleRepository;
        private final AuthenticationManager authenticationManager;
        private final JwtTokenProvider jwtTokenProvider;
        private final CustomerRepository customerRepository;

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
                if (userService.existsByUsername(request.username())) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Username đã tồn tại"));
                }

                if (request.email() != null && !request.email().isBlank()
                                && userService.existsByEmail(request.email())) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Email đã tồn tại"));
                }

                String roleName = request.roleName() == null || request.roleName().isBlank()
                                ? "ROLE_KHACH_HANG"
                                : request.roleName();

                Role role = roleRepository.findByRoleName(roleName)
                                .orElseGet(() -> roleRepository.save(Role.builder()
                                                .roleName(roleName)
                                                .description(roleName)
                                                .build()));

                User user = User.builder()
                                .username(request.username())
                                .password(request.password())
                                .fullName(request.fullName())
                                .email(request.email())
                                .phone(request.phone())
                                .role(role)
                                .status("ACTIVE")
                                .build();

                User savedUser = userService.save(user);

                // Auto-create a Customer record if the user role is KHACH_HANG or CUSTOMER
                if ("ROLE_KHACH_HANG".equals(roleName) || "ROLE_CUSTOMER".equals(roleName)) {
                    boolean customerExists = false;
                    if (request.phone() != null && !request.phone().isBlank()) {
                        customerExists = customerRepository.findByPhone(request.phone()).isPresent();
                    }
                    if (!customerExists && request.email() != null && !request.email().isBlank()) {
                        customerExists = customerRepository.findByEmail(request.email()).isPresent();
                    }
                    if (!customerExists) {
                        Customer customer = Customer.builder()
                                        .fullName(request.fullName())
                                        .phone(request.phone())
                                        .email(request.email())
                                        .customerType("THUONG")
                                        .build();
                        customerRepository.save(customer);
                    }
                }

                return ResponseEntity.status(HttpStatus.CREATED).body(toUserResponse(savedUser));
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginRequest request) {
                try {
                        Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.username(), request.password())
                        );

                        String token = jwtTokenProvider.generateToken(authentication);

                        User user = userService.findByUsername(request.username()).orElse(null);

                        if (user != null && "LOCKED".equalsIgnoreCase(user.getStatus())) {
                                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                                .body(Map.of("message", "Tài khoản đã bị khóa"));
                        }

                        return ResponseEntity.ok(Map.of(
                                        "message", "Đăng nhập thành công",
                                        "token", token,
                                        "id", user != null ? user.getId() : 0L,
                                        "username", request.username(),
                                        "fullName", user != null ? (user.getFullName() != null ? user.getFullName() : request.username()) : request.username(),
                                        "role", user != null && user.getRole() != null ? user.getRole().getRoleName() : "ROLE_ADMIN",
                                        "imageUrl", user != null && user.getImageUrl() != null ? user.getImageUrl() : ""
                        ));
                } catch (AuthenticationException e) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(Map.of("message", "Sai tài khoản hoặc mật khẩu"));
                }
        }

        private UserResponse toUserResponse(User user) {
                return new UserResponse(
                                user.getId(),
                                user.getUsername(),
                                user.getFullName(),
                                user.getEmail(),
                                user.getPhone(),
                                user.getStatus(),
                                user.getRole() != null ? user.getRole().getRoleName() : null,
                                user.getImageUrl());
        }

        public record RegisterRequest(
                        String username,
                        String password,
                        String fullName,
                        String email,
                        String phone,
                        String roleName) {
        }

        public record LoginRequest(String username, String password) {
        }

        public record UserResponse(
                        Long id,
                        String username,
                        String fullName,
                        String email,
                        String phone,
                        String status,
                        String roleName,
                        String imageUrl) {
        }
}
