package toanweb2.DoAnWeb2.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import toanweb2.DoAnWeb2.entity.Promotion;
import toanweb2.DoAnWeb2.service.PromotionService;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable Long id) {
        return promotionService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Promotion> getPromotionByCode(@PathVariable String code) {
        return promotionService.findByCode(code)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Promotion>> getActivePromotions() {
        return ResponseEntity.ok(promotionService.findActivePromotions());
    }

    @GetMapping("/check/{code}")
    public ResponseEntity<Map<String, Boolean>> checkPromotion(@PathVariable String code) {
        return ResponseEntity.ok(Map.of("valid", promotionService.isValidPromotion(code)));
    }

    /** Lấy tất cả khuyến mãi ACTIVE đang áp dụng cho 1 dịch vụ cụ thể */
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Promotion>> getByServiceId(@PathVariable Long serviceId) {
        return ResponseEntity.ok(promotionService.findByServiceId(serviceId));
    }

    @PostMapping
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        return ResponseEntity.status(HttpStatus.CREATED).body(promotionService.save(promotion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Promotion> updatePromotion(@PathVariable Long id, @RequestBody Promotion promotion) {
        return ResponseEntity.ok(promotionService.update(id, promotion));
    }

    /** Cập nhật danh sách dịch vụ được áp dụng cho 1 khuyến mãi */
    @PutMapping("/{id}/services")
    public ResponseEntity<Promotion> setApplicableServices(
            @PathVariable Long id,
            @RequestBody Set<Long> serviceIds) {
        return ResponseEntity.ok(promotionService.setApplicableServices(id, serviceIds));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        promotionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
