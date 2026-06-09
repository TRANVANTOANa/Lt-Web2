package toanweb2.DoAnWeb2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "import_receipts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    private BigDecimal totalAmount;

    private LocalDateTime importDate;

    @Column(columnDefinition = "TEXT")
    private String note;

    @OneToMany(mappedBy = "importReceipt", cascade = CascadeType.ALL)
    private Set<ImportReceiptDetail> importReceiptDetails;

    @PrePersist
    protected void onCreate() {
        importDate = LocalDateTime.now();
    }
}
