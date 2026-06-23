package toanweb2.DoAnWeb2.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private String username;
    private String role;
    private String fullName;
}
