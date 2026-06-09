package toanweb2.DoAnWeb2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false)
    private LocalTime appointmentTime;

    @Column(columnDefinition = "VARCHAR(30) DEFAULT 'DANG_CHO'")
    private String status; // DANG_CHO, DA_XAC_NHAN, DANG_THUC_HIEN, HOAN_THANH, DA_HUY, KHACH_KHONG_DEN

    @Column(columnDefinition = "TEXT")
    private String note;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL)
    private Set<AppointmentDetail> appointmentDetails;

    @OneToOne(mappedBy = "appointment")
    private Invoice invoice;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "DANG_CHO";
    }
}
