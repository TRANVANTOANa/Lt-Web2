package toanweb2.DoAnWeb2.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import toanweb2.DoAnWeb2.entity.Review;
import toanweb2.DoAnWeb2.repository.ReviewRepository;
import toanweb2.DoAnWeb2.service.ReviewService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public List<Review> findAll() {
        return reviewRepository.findAll();
    }

    @Override
    public Optional<Review> findById(Long id) {
        return reviewRepository.findById(id);
    }

    @Override
    public List<Review> findByCustomerId(Long customerId) {
        return reviewRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Review> findByServiceId(Long serviceId) {
        return reviewRepository.findByServiceId(serviceId);
    }

    @Override
    public Review save(Review review) {
        return reviewRepository.save(review);
    }

    @Override
    public void deleteById(Long id) {
        reviewRepository.deleteById(id);
    }
}
