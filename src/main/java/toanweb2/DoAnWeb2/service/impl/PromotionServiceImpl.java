package toanweb2.DoAnWeb2.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import toanweb2.DoAnWeb2.entity.Promotion;
import toanweb2.DoAnWeb2.entity.SpaService;
import toanweb2.DoAnWeb2.repository.PromotionRepository;
import toanweb2.DoAnWeb2.repository.SpaServiceRepository;
import toanweb2.DoAnWeb2.service.PromotionService;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final SpaServiceRepository spaServiceRepository;

    @Override
    public List<Promotion> findAll() {
        return promotionRepository.findAll();
    }

    @Override
    public Optional<Promotion> findById(Long id) {
        return promotionRepository.findById(id);
    }

    @Override
    public Optional<Promotion> findByCode(String code) {
        return promotionRepository.findByCode(code);
    }

    @Override
    public List<Promotion> findActivePromotions() {
        return promotionRepository.findByStatus("ACTIVE");
    }

    @Override
    public List<Promotion> findByServiceId(Long serviceId) {
        return promotionRepository.findActiveByServiceId(serviceId);
    }

    @Override
    @Transactional
    public Promotion save(Promotion promotion) {
        if (promotion.getApplicableServices() == null) {
            promotion.setApplicableServices(new HashSet<>());
        }
        return promotionRepository.save(promotion);
    }

    @Override
    @Transactional
    public Promotion update(Long id, Promotion promotion) {
        Promotion existing = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mãi với ID: " + id));
        existing.setCode(promotion.getCode());
        existing.setName(promotion.getName());
        existing.setDiscountType(promotion.getDiscountType());
        existing.setDiscountValue(promotion.getDiscountValue());
        existing.setStartDate(promotion.getStartDate());
        existing.setEndDate(promotion.getEndDate());
        existing.setStatus(promotion.getStatus());
        return promotionRepository.save(existing);
    }

    @Override
    @Transactional
    public Promotion setApplicableServices(Long promotionId, Set<Long> serviceIds) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mãi với ID: " + promotionId));
        Set<SpaService> services = new HashSet<>(spaServiceRepository.findAllById(serviceIds));
        promotion.setApplicableServices(services);
        return promotionRepository.save(promotion);
    }

    @Override
    public void deleteById(Long id) {
        promotionRepository.deleteById(id);
    }

    @Override
    public boolean isValidPromotion(String code) {
        Optional<Promotion> promotion = promotionRepository.findByCode(code);
        if (promotion.isEmpty()) return false;

        Promotion p = promotion.get();
        LocalDate today = LocalDate.now();
        return "ACTIVE".equals(p.getStatus())
                && !today.isBefore(p.getStartDate())
                && !today.isAfter(p.getEndDate());
    }
}
