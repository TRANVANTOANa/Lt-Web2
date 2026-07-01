package toanweb2.DoAnWeb2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "service_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'ACTIVE'")
    private String status; // ACTIVE, INACTIVE

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "category")
    private Set<SpaService> spaServices;

    @PrePersist
    protected void onCreate() {
        if (status == null) status = "ACTIVE";
    }
}
