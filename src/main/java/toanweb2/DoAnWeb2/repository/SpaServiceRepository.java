package toanweb2.DoAnWeb2.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import toanweb2.DoAnWeb2.entity.SpaService;

import java.util.List;

@Repository
public interface SpaServiceRepository extends JpaRepository<SpaService, Long> {
    List<SpaService> findByCategoryId(Long categoryId);
    List<SpaService> findByStatus(String status);
    List<SpaService> findByNameContainingIgnoreCase(String name);

    // Dịch vụ mới nhất (sắp xếp theo ngày tạo giảm dần)
    List<SpaService> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    // Dịch vụ hot (được đặt lịch nhiều nhất)
    @Query("SELECT s FROM SpaService s LEFT JOIN Appointment a ON a.service.id = s.id " +
           "WHERE s.status = 'ACTIVE' " +
           "GROUP BY s.id ORDER BY COUNT(a.id) DESC")
    List<SpaService> findHotServices(Pageable pageable);
}

