package toanweb2.DoAnWeb2.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import toanweb2.DoAnWeb2.entity.User;
import toanweb2.DoAnWeb2.service.UserService;

import toanweb2.DoAnWeb2.dto.request.ChangePasswordRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll().stream().map(this::toUserResponse).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(user -> ResponseEntity.ok(toUserResponse(user)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchByFullName(@RequestParam String fullName) {
        return ResponseEntity.ok(userService.searchByFullName(fullName).stream().map(this::toUserResponse).toList());
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(toUserResponse(userService.save(user)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(toUserResponse(userService.update(id, user)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/lock")
    public ResponseEntity<Map<String, String>> lockUser(@PathVariable Long id) {
        userService.lockUser(id);
        return ResponseEntity.ok(Map.of("message", "Đã khóa tài khoản"));
    }

    @PutMapping("/{id}/unlock")
    public ResponseEntity<Map<String, String>> unlockUser(@PathVariable Long id) {
        userService.unlockUser(id);
        return ResponseEntity.ok(Map.of("message", "Đã mở khóa tài khoản"));
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request) {
        userService.changePassword(id, request.oldPassword(), request.newPassword());
        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
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

    public record ChangePasswordRequest(String oldPassword, String newPassword) {
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
