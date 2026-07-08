package toanweb2.DoAnWeb2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private SpaService service;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false)
    private LocalTime appointmentTime;

    private Integer duration; // phút

    private BigDecimal price;

    @Column(columnDefinition = "VARCHAR(30) DEFAULT 'DANG_CHO'")
    private String status; // DANG_CHO, DA_XAC_NHAN, DANG_THUC_HIEN, HOAN_THANH, DA_HUY, KHACH_KHONG_DEN

    @Column(columnDefinition = "TEXT")
    private String note;

    private LocalDateTime createdAt;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne(mappedBy = "appointment")
    private Invoice invoice;

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("appointmentDetails")
    private java.util.List<java.util.Map<String, Object>> appointmentDetails;

    public java.util.List<java.util.Map<String, Object>> getAppointmentDetails() {
        if (this.service != null) {
            java.util.Map<String, Object> detail = new java.util.HashMap<>();
            detail.put("id", this.id);
            detail.put("service", this.service);
            detail.put("price", this.price);
            detail.put("duration", this.duration);
            return java.util.List.of(detail);
        }
        return appointmentDetails;
    }

    public void setAppointmentDetails(java.util.List<java.util.Map<String, Object>> appointmentDetails) {
        this.appointmentDetails = appointmentDetails;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "DANG_CHO";
    }
}
