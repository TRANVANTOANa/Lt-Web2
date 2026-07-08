package toanweb2.DoAnWeb2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;


@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    private String phone;

    private String email;

    private String gender;

    private String position; // LE_TAN, KY_THUAT, QUAN_LY

    private BigDecimal salary;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'DANG_LAM'")
    private String status; // DANG_LAM, NGHI_VIEC, TAM_NGHI

    private LocalDateTime createdAt;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "employee")
    private Set<Appointment> appointments;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "DANG_LAM";
    }
}
