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
        private final org.springframework.mail.javamail.JavaMailSender mailSender;
        private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

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

                String token = "";
                try {
                    Authentication authentication = authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(request.username(), request.password())
                    );
                    token = jwtTokenProvider.generateToken(authentication);
                } catch (Exception e) {
                    // Fallback
                }

                return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                                "message", "Đăng ký thành công",
                                "token", token,
                                "id", savedUser.getId(),
                                "username", savedUser.getUsername(),
                                "fullName", savedUser.getFullName() != null ? savedUser.getFullName() : savedUser.getUsername(),
                                "role", savedUser.getRole() != null ? savedUser.getRole().getRoleName() : "ROLE_KHACH_HANG",
                                "imageUrl", savedUser.getImageUrl() != null ? savedUser.getImageUrl() : ""
                ));
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
                                        "imageUrl", user != null && user.getImageUrl() != null ? user.getImageUrl() : "",
                                        "phone", user != null && user.getPhone() != null ? user.getPhone() : "",
                                        "email", user != null && user.getEmail() != null ? user.getEmail() : ""
                        ));
                } catch (AuthenticationException e) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(Map.of("message", "Sai tài khoản hoặc mật khẩu"));
                }
        }

        @PostMapping("/forgot-password")
        public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
                if (request.email() == null || request.email().isBlank()) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Email không được để trống"));
                }

                java.util.Optional<User> userOptional = userService.findByEmail(request.email());
                if (userOptional.isEmpty()) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Email không tồn tại trong hệ thống"));
                }

                User user = userOptional.get();

                // Tạo mật khẩu tạm thời ngẫu nhiên độ dài 8 ký tự
                String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                java.util.Random rnd = new java.util.Random();
                StringBuilder sb = new StringBuilder(8);
                for (int i = 0; i < 8; i++) {
                        sb.append(chars.charAt(rnd.nextInt(chars.length())));
                }
                String tempPassword = sb.toString();

                try {
                        // 1. Gửi email
                        org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
                        message.setFrom("pukachi1132@gmail.com");
                        message.setTo(user.getEmail());
                        message.setSubject("[Spa Beauty] Khôi phục mật khẩu tài khoản");
                        message.setText("Xin chào " + (user.getFullName() != null ? user.getFullName() : user.getUsername()) + ",\n\n" +
                                        "Bạn đã yêu cầu khôi phục mật khẩu cho tài khoản tại Spa Beauty.\n" +
                                        "Mật khẩu tạm thời mới của bạn là: " + tempPassword + "\n\n" +
                                        "Vui lòng đăng nhập bằng mật khẩu tạm thời này và thay đổi mật khẩu ngay lập tức để bảo mật tài khoản.\n\n" +
                                        "Trân trọng,\n" +
                                        "Spa Beauty Support Team");
                        mailSender.send(message);

                        // 2. Cập nhật mật khẩu trong Database
                        user.setPassword(tempPassword);
                        userService.save(user);

                        return ResponseEntity.ok(Map.of("message", "Mật khẩu mới đã được gửi tới email của bạn."));
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(Map.of("message", "Không thể gửi email khôi phục mật khẩu. Lỗi: " + e.getMessage()));
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

        public record ForgotPasswordRequest(String email) {
        }
}
