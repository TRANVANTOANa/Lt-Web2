package toanweb2.DoAnWeb2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import toanweb2.DoAnWeb2.entity.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByStatus(String status);
    List<Product> findByNameContainingIgnoreCase(String name);
}
