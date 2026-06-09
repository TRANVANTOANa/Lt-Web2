package toanweb2.DoAnWeb2.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import toanweb2.DoAnWeb2.entity.ServiceCategory;
import toanweb2.DoAnWeb2.repository.ServiceCategoryRepository;
import toanweb2.DoAnWeb2.service.ServiceCategoryService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceCategoryServiceImpl implements ServiceCategoryService {

    private final ServiceCategoryRepository serviceCategoryRepository;

    @Override
    public List<ServiceCategory> findAll() {
        return serviceCategoryRepository.findAll();
    }

    @Override
    public Optional<ServiceCategory> findById(Long id) {
        return serviceCategoryRepository.findById(id);
    }

    @Override
    public List<ServiceCategory> findByStatus(String status) {
        return serviceCategoryRepository.findByStatus(status);
    }

    @Override
    public ServiceCategory save(ServiceCategory category) {
        return serviceCategoryRepository.save(category);
    }

    @Override
    public ServiceCategory update(Long id, ServiceCategory category) {
        ServiceCategory existing = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));
        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        existing.setStatus(category.getStatus());
        return serviceCategoryRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        serviceCategoryRepository.deleteById(id);
    }
}
