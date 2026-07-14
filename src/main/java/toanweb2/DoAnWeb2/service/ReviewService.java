package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    List<Review> findAll();
    Optional<Review> findById(Long id);
    List<Review> findByCustomerId(Long customerId);
    List<Review> findByServiceId(Long serviceId);
    List<Review> findByAppointmentId(Long appointmentId);
    Review save(Review review);
    void deleteById(Long id);
}
