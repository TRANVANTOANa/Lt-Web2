package toanweb2.DoAnWeb2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import toanweb2.DoAnWeb2.entity.Promotion;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findByCode(String code);
    List<Promotion> findByStatus(String status);
    List<Promotion> findByEndDateAfter(LocalDate date);

    @Query("SELECT p FROM Promotion p JOIN p.applicableServices s WHERE s.id = :serviceId AND p.status = 'ACTIVE'")
    List<Promotion> findActiveByServiceId(@Param("serviceId") Long serviceId);

    @Query("SELECT p FROM Promotion p JOIN p.applicableServices s WHERE s.id = :serviceId")
    List<Promotion> findByServiceId(@Param("serviceId") Long serviceId);
}
