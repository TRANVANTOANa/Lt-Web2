package toanweb2.DoAnWeb2.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import toanweb2.DoAnWeb2.dto.request.LoginRequest;
import toanweb2.DoAnWeb2.dto.request.RegisterRequest;
import toanweb2.DoAnWeb2.dto.response.JwtResponse;
import toanweb2.DoAnWeb2.entity.Role;
import toanweb2.DoAnWeb2.entity.User;
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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userService.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username đã tồn tại"));
        }

        if (request.getEmail() != null && !request.getEmail().isBlank() && userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email đã tồn tại"));
        }

        String roleName = request.getRoleName() == null || request.getRoleName().isBlank()
                ? "ROLE_CUSTOMER"
                : request.getRoleName();

        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }
        final String finalRoleName = roleName;

        Role role = roleRepository.findByRoleName(finalRoleName)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .roleName(finalRoleName)
                        .description(finalRoleName)
                        .build()));

        User user = User.builder()
                .username(request.getUsername())
                .password(request.getPassword())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(role)
                .status("ACTIVE")
                .build();

        User savedUser = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(toUserResponse(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Authenticate credentials via AuthenticationManager (which will use PasswordEncoder.matches)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        User user = userService.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        if ("LOCKED".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Tài khoản đã bị khóa"));
        }

        return ResponseEntity.ok(JwtResponse.builder()
                .token(jwt)
                .username(user.getUsername())
                .role(user.getRole() != null ? user.getRole().getRoleName() : "ROLE_CUSTOMER")
                .fullName(user.getFullName())
                .build());
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getStatus(),
                user.getRole() != null ? user.getRole().getRoleName() : null
        );
    }

    public record UserResponse(
            Long id,
            String username,
            String fullName,
            String email,
            String phone,
            String status,
            String roleName
    ) {}
}
