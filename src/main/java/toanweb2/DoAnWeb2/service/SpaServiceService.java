package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.SpaService;

import java.util.List;
import java.util.Optional;

public interface SpaServiceService {
    List<SpaService> findAll();
    Optional<SpaService> findById(Long id);
    List<SpaService> findByCategoryId(Long categoryId);
    List<SpaService> findByStatus(String status);
    List<SpaService> searchByName(String name);
    SpaService save(SpaService spaService);
    SpaService update(Long id, SpaService spaService);
    void deleteById(Long id);
    void toggleStatus(Long id);
}
