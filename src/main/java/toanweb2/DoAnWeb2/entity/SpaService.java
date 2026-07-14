package toanweb2.DoAnWeb2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;


@Entity
@Table(name = "spa_services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpaService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ServiceCategory category;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private Integer duration; // Thời gian thực hiện (phút)

    private String image;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'ACTIVE'")
    private String status; // ACTIVE, INACTIVE

    private LocalDateTime createdAt;


    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "service")
    private Set<Review> reviews;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "ACTIVE";
    }

    @com.fasterxml.jackson.annotation.JsonProperty("rating")
    public Double getRating() {
        if (reviews == null || reviews.isEmpty()) {
            return 4.9;
        }
        double sum = 0;
        int count = 0;
        for (Review r : reviews) {
            if (r.getRating() != null) {
                sum += r.getRating();
                count++;
            }
        }
        if (count == 0) {
            return 4.9;
        }
        return Math.round((sum / count) * 10.0) / 10.0;
    }
}
