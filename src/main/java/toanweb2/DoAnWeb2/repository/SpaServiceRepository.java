package toanweb2.DoAnWeb2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import toanweb2.DoAnWeb2.entity.SpaService;

import java.util.List;

@Repository
public interface SpaServiceRepository extends JpaRepository<SpaService, Long> {
    List<SpaService> findByCategoryId(Long categoryId);
    List<SpaService> findByStatus(String status);
    List<SpaService> findByNameContainingIgnoreCase(String name);
}
