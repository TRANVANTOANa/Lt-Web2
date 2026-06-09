package toanweb2.DoAnWeb2.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import toanweb2.DoAnWeb2.entity.Promotion;
import toanweb2.DoAnWeb2.repository.PromotionRepository;
import toanweb2.DoAnWeb2.service.PromotionService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;

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
    public Promotion save(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    @Override
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
