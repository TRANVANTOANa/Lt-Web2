package toanweb2.DoAnWeb2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    private String phone;

    private String email;

    private String gender;

    private LocalDate birthday;

    private String address;

    private String imageUrl;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'THUONG'")
    private String customerType; // THUONG, VIP, THAN_THIET

    @Column(columnDefinition = "TEXT")
    private String note; // Ghi chú sức khỏe, dị ứng, yêu cầu đặc biệt

    private LocalDateTime createdAt;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "customer")
    private Set<Appointment> appointments;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "customer")
    private Set<Review> reviews;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "customer")
    private Set<Invoice> invoices;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (customerType == null) customerType = "THUONG";
    }
}
