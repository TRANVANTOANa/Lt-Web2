package toanweb2.DoAnWeb2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    private String paymentMethod; // TIEN_MAT, CHUYEN_KHOAN, THE

    private BigDecimal amount;

    private LocalDateTime paymentDate;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'THANH_CONG'")
    private String status; // THANH_CONG, THAT_BAI

    @PrePersist
    protected void onCreate() {
        paymentDate = LocalDateTime.now();
        if (status == null) status = "THANH_CONG";
    }
}
