package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<Product> findAll();
    Optional<Product> findById(Long id);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> searchByName(String name);
    Product save(Product product);
    Product update(Long id, Product product);
    void deleteById(Long id);
    void updateStock(Long id, int quantity);
}
