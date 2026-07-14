package toanweb2.DoAnWeb2.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import toanweb2.DoAnWeb2.entity.SpaService;
import toanweb2.DoAnWeb2.service.SpaServiceService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/spa-services")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SpaServiceController {

    private final SpaServiceService spaServiceService;

    @GetMapping
    public ResponseEntity<List<SpaService>> getAllServices() {
        return ResponseEntity.ok(spaServiceService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpaService> getServiceById(@PathVariable Long id) {
        return spaServiceService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<SpaService>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(spaServiceService.findByCategoryId(categoryId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<SpaService>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(spaServiceService.findByStatus(status));
    }

    @GetMapping("/search")
    public ResponseEntity<List<SpaService>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(spaServiceService.searchByName(name));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<SpaService>> getLatestServices(
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(spaServiceService.findLatest(limit));
    }

    @GetMapping("/hot")
    public ResponseEntity<List<SpaService>> getHotServices(
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(spaServiceService.findHot(limit));
    }

    @PostMapping
    public ResponseEntity<SpaService> createService(@RequestBody SpaService spaService) {
        return ResponseEntity.status(HttpStatus.CREATED).body(spaServiceService.save(spaService));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpaService> updateService(@PathVariable Long id, @RequestBody SpaService spaService) {
        return ResponseEntity.ok(spaServiceService.update(id, spaService));
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<Map<String, String>> toggleStatus(@PathVariable Long id) {
        spaServiceService.toggleStatus(id);
        return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái dịch vụ thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        spaServiceService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
