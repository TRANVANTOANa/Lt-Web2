package toanweb2.DoAnWeb2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roomName;

    private String description;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'TRONG'")
    private String status; // TRONG, DANG_SU_DUNG, BAO_TRI

    @OneToMany(mappedBy = "room")
    private Set<Appointment> appointments;

    @PrePersist
    protected void onCreate() {
        if (status == null) status = "TRONG";
    }
}
