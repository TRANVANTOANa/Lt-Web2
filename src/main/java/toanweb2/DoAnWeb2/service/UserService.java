package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findAll();
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
    List<User> searchByFullName(String fullName);
    User save(User user);
    User update(Long id, User user);
    void deleteById(Long id);
    void lockUser(Long id);
    void unlockUser(Long id);
    void changePassword(Long id, String oldPassword, String newPassword);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}
