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

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "appointment_services",
        joinColumns = @JoinColumn(name = "appointment_id"),
        inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private java.util.List<SpaService> services;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    private LocalDateTime createdAt;

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("appointment")
    @OneToOne(mappedBy = "appointment")
    private Invoice invoice;

    @Transient
    private String paymentMethod;

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("appointmentDetails")
    private java.util.List<java.util.Map<String, Object>> appointmentDetails;

    public java.util.List<java.util.Map<String, Object>> getAppointmentDetails() {
        if (this.services != null && !this.services.isEmpty()) {
            java.util.List<java.util.Map<String, Object>> details = new java.util.ArrayList<>();
            for (SpaService svc : this.services) {
                java.util.Map<String, Object> detail = new java.util.HashMap<>();
                detail.put("id", this.id);
                detail.put("service", svc);
                // Try to use individual service price/duration if possible, otherwise fall back to appointment fields
                detail.put("price", svc.getPrice() != null ? svc.getPrice() : this.price);
                detail.put("duration", svc.getDuration() != null ? svc.getDuration() : this.duration);
                details.add(detail);
            }
            return details;
        } else if (this.service != null) {
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
