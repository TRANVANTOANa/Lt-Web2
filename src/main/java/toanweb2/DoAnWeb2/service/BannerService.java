package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.Banner;

import java.util.List;
import java.util.Optional;

public interface BannerService {
    List<Banner> findAll();
    List<Banner> findActive();
    Optional<Banner> findById(Long id);
    Banner save(Banner banner);
    Banner update(Long id, Banner banner);
    void deleteById(Long id);
}
