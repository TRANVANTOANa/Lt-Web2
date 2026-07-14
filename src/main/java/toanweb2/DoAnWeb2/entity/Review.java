package toanweb2.DoAnWeb2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private SpaService service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private Integer rating; // 1-5 đánh giá dịch vụ

    @Column(columnDefinition = "TEXT")
    private String comment; // nhận xét dịch vụ

    private Integer employeeRating; // 1-5 đánh giá kỹ thuật viên

    @Column(columnDefinition = "TEXT")
    private String employeeComment; // nhận xét kỹ thuật viên

    private String imageUrl; // hình ảnh thực tế (tùy chọn)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("appointmentDetails")
    private Appointment appointment;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
