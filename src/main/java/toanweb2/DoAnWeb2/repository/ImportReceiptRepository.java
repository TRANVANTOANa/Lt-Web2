package toanweb2.DoAnWeb2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import toanweb2.DoAnWeb2.entity.ImportReceipt;

@Repository
public interface ImportReceiptRepository extends JpaRepository<ImportReceipt, Long> {
}
