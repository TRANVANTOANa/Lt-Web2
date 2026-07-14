package toanweb2.DoAnWeb2.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import toanweb2.DoAnWeb2.entity.Banner;
import toanweb2.DoAnWeb2.repository.BannerRepository;
import toanweb2.DoAnWeb2.service.BannerService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;

    @Override
    public List<Banner> findAll() {
        return bannerRepository.findAllByOrderByOrderNoAsc();
    }

    @Override
    public List<Banner> findActive() {
        return bannerRepository.findByStatusOrderByOrderNoAsc("ACTIVE");
    }

    @Override
    public Optional<Banner> findById(Long id) {
        return bannerRepository.findById(id);
    }

    @Override
    public Banner save(Banner banner) {
        if (banner.getStatus() == null) banner.setStatus("ACTIVE");
        if (banner.getOrderNo() == null) banner.setOrderNo(0);
        return bannerRepository.save(banner);
    }

    @Override
    public Banner update(Long id, Banner banner) {
        Banner existing = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy banner với ID: " + id));
        existing.setTitle(banner.getTitle());
        existing.setSubtitle(banner.getSubtitle());
        existing.setImageUrl(banner.getImageUrl());
        existing.setLinkUrl(banner.getLinkUrl());
        existing.setOrderNo(banner.getOrderNo());
        existing.setStatus(banner.getStatus());
        return bannerRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        bannerRepository.deleteById(id);
    }
}
