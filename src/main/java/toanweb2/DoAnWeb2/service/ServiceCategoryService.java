package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.ServiceCategory;

import java.util.List;
import java.util.Optional;

public interface ServiceCategoryService {
    List<ServiceCategory> findAll();
    Optional<ServiceCategory> findById(Long id);
    List<ServiceCategory> findByStatus(String status);
    ServiceCategory save(ServiceCategory category);
    ServiceCategory update(Long id, ServiceCategory category);
    void deleteById(Long id);
}
