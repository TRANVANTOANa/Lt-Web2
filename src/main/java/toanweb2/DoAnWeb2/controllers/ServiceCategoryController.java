package toanweb2.DoAnWeb2.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import toanweb2.DoAnWeb2.entity.ServiceCategory;
import toanweb2.DoAnWeb2.service.ServiceCategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/service-categories")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ServiceCategoryController {

    private final ServiceCategoryService serviceCategoryService;

    @GetMapping
    public ResponseEntity<List<ServiceCategory>> getAllCategories() {
        return ResponseEntity.ok(serviceCategoryService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceCategory> getCategoryById(@PathVariable Long id) {
        return serviceCategoryService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ServiceCategory>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(serviceCategoryService.findByStatus(status));
    }

    @PostMapping
    public ResponseEntity<ServiceCategory> createCategory(@RequestBody ServiceCategory category) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceCategoryService.save(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceCategory> updateCategory(@PathVariable Long id, @RequestBody ServiceCategory category) {
        return ResponseEntity.ok(serviceCategoryService.update(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        serviceCategoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
