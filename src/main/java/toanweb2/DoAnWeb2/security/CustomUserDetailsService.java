package toanweb2.DoAnWeb2.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import toanweb2.DoAnWeb2.entity.User;
import toanweb2.DoAnWeb2.repository.UserRepository;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println(">>> loadUserByUsername CALLED FOR: " + username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println(">>> User NOT FOUND: " + username);
                    return new UsernameNotFoundException("Không tìm thấy tài khoản với username: " + username);
                });
        System.out.println(">>> User FOUND: " + username + ", encoded password: " + user.getPassword());

        if ("LOCKED".equals(user.getStatus())) {
            throw new UsernameNotFoundException("Tài khoản đã bị khóa: " + username);
        }

        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "KHACH_HANG";
        String authorityName = roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(authorityName))
        );
    }
}
