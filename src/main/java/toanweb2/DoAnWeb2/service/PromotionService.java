package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.Promotion;

import java.util.List;
import java.util.Optional;

public interface PromotionService {
    List<Promotion> findAll();
    Optional<Promotion> findById(Long id);
    Optional<Promotion> findByCode(String code);
    List<Promotion> findActivePromotions();
    Promotion save(Promotion promotion);
    Promotion update(Long id, Promotion promotion);
    void deleteById(Long id);
    boolean isValidPromotion(String code);
}
