package toanweb2.DoAnWeb2.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import toanweb2.DoAnWeb2.entity.SpaService;
import toanweb2.DoAnWeb2.repository.SpaServiceRepository;
import toanweb2.DoAnWeb2.service.SpaServiceService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SpaServiceServiceImpl implements SpaServiceService {

    private final SpaServiceRepository spaServiceRepository;

    @Override
    public List<SpaService> findAll() {
        return spaServiceRepository.findAll();
    }

    @Override
    public Optional<SpaService> findById(Long id) {
        return spaServiceRepository.findById(id);
    }

    @Override
    public List<SpaService> findByCategoryId(Long categoryId) {
        return spaServiceRepository.findByCategoryId(categoryId);
    }

    @Override
    public List<SpaService> findByStatus(String status) {
        return spaServiceRepository.findByStatus(status);
    }

    @Override
    public List<SpaService> searchByName(String name) {
        return spaServiceRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public SpaService save(SpaService spaService) {
        return spaServiceRepository.save(spaService);
    }

    @Override
    public SpaService update(Long id, SpaService spaService) {
        SpaService existing = spaServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + id));
        existing.setName(spaService.getName());
        existing.setDescription(spaService.getDescription());
        existing.setPrice(spaService.getPrice());
        existing.setDuration(spaService.getDuration());
        existing.setImage(spaService.getImage());
        existing.setCategory(spaService.getCategory());
        existing.setStatus(spaService.getStatus());
        return spaServiceRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        spaServiceRepository.deleteById(id);
    }

    @Override
    public void toggleStatus(Long id) {
        SpaService spaService = spaServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + id));
        if ("ACTIVE".equals(spaService.getStatus())) {
            spaService.setStatus("INACTIVE");
        } else {
            spaService.setStatus("ACTIVE");
        }
        spaServiceRepository.save(spaService);
    }

    @Override
    public List<SpaService> findLatest(int limit) {
        return spaServiceRepository.findByStatusOrderByCreatedAtDesc("ACTIVE", PageRequest.of(0, limit));
    }

    @Override
    public List<SpaService> findHot(int limit) {
        return spaServiceRepository.findHotServices(PageRequest.of(0, limit));
    }
}

