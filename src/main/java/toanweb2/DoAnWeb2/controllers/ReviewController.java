package toanweb2.DoAnWeb2.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import toanweb2.DoAnWeb2.entity.Review;
import toanweb2.DoAnWeb2.service.ReviewService;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        return reviewService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Review>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(reviewService.findByCustomerId(customerId));
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Review>> getByService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.findByServiceId(serviceId));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<Review>> getByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(reviewService.findByAppointmentId(appointmentId));
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.save(review));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
