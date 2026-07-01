package toanweb2.DoAnWeb2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "promotions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    private String discountType; // PERCENT, AMOUNT

    private BigDecimal discountValue;

    private LocalDate startDate;

    private LocalDate endDate;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'ACTIVE'")
    private String status; // ACTIVE, INACTIVE, EXPIRED

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "promotion")
    private Set<Invoice> invoices;

    @PrePersist
    protected void onCreate() {
        if (status == null) status = "ACTIVE";
    }
}
