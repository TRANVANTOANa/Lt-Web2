package toanweb2.DoAnWeb2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    @Column(nullable = false)
    private BigDecimal totalAmount; // Tổng tiền trước giảm giá

    @Column(columnDefinition = "DECIMAL(15,2) DEFAULT 0")
    private BigDecimal discountAmount; // Số tiền giảm

    @Column(nullable = false)
    private BigDecimal finalAmount; // Tổng tiền sau giảm giá

    @Column(columnDefinition = "VARCHAR(30) DEFAULT 'TIEN_MAT'")
    private String paymentMethod; // TIEN_MAT, CHUYEN_KHOAN, THE

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'CHUA_THANH_TOAN'")
    private String paymentStatus; // CHUA_THANH_TOAN, DA_THANH_TOAN

    private LocalDateTime paidAt; // Thời điểm thanh toán

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (paymentStatus == null) paymentStatus = "CHUA_THANH_TOAN";
        if (discountAmount == null) discountAmount = BigDecimal.ZERO;
    }
}
