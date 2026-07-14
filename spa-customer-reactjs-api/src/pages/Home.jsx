import { Link } from 'react-router-dom';
import { CalendarCheck, HeartPulse, ShieldCheck, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { serviceApi } from '../api/serviceApi';
import { bannerApi } from '../api/bannerApi';
import ServiceCard from '../components/ServiceCard';
import { mockServices } from '../data/mockData';

const mockBanners = [
  {
    id: 1,
    title: "Thư giãn cơ thể, làm đẹp làn da, phục hồi năng lượng mỗi ngày",
    subtitle: "Spa chăm sóc sắc đẹp cao cấp",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200",
    linkUrl: "/booking"
  },
  {
    id: 2,
    title: "Ưu đãi 20% cho liệu trình Chăm sóc da lần đầu",
    subtitle: "Khơi dậy vẻ đẹp tự nhiên của bạn",
    imageUrl: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1200",
    linkUrl: "/services"
  },
  {
    id: 3,
    title: "Gội đầu dưỡng sinh & Bấm huyệt vai gáy",
    subtitle: "Giảm stress, mệt mỏi, tái tạo năng lượng tức thì",
    imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1200",
    linkUrl: "/services"
  }
];

export default function Home() {
  const [hotServices, setHotServices] = useState([]);
  const [latestServices, setLatestServices] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const attachPromos = (svcs, promos) =>
      svcs.map(svc => ({
        ...svc,
        promotions: promos.filter(p =>
          (p.applicableServices || []).some(s => s.id === svc.id)
        )
      }));

    Promise.all([
      serviceApi.getHot(4).catch(() => mockServices.slice(0, 4)),
      serviceApi.getLatest(4).catch(() => mockServices.slice(0, 4)),
      bannerApi.getActive().catch(() => mockBanners),
      axiosClient.get('/promotions/active').catch(() => []),
    ]).then(([hot, latest, bannerData, promos]) => {
      const promoList = Array.isArray(promos) ? promos : [];
      setHotServices(attachPromos(hot?.length ? hot : mockServices.slice(0, 4), promoList));
      setLatestServices(attachPromos(latest?.length ? latest : mockServices.slice(0, 4), promoList));
      setBanners(bannerData?.length ? bannerData : mockBanners);
    });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="page">
      {/* Banner dynamic slideshow */}
      {banners.length > 0 && (
        <section className="hero-slider">
          <div className="slide-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {banners.map((slide, index) => (
              <div key={slide.id || index} className={`slide-item ${index === currentSlide ? 'active' : ''}`}>
                <div className="slide-content">
                  {slide.subtitle && <span className="slide-eyebrow">{slide.subtitle}</span>}
                  <h1 className="slide-title">{slide.title}</h1>
                  <div className="hero-actions">
                    <Link className="btn solid big" to={slide.linkUrl || "/booking"}>Đặt lịch ngay</Link>
                    <Link className="btn ghost big" to="/services">Xem dịch vụ</Link>
                  </div>
                </div>
                <div className="slide-image-container">
                  {slide.imageUrl ? (
                    <img className="slide-img" src={slide.imageUrl} alt={slide.title} />
                  ) : (
                    <div className="slide-img" style={{ background: 'linear-gradient(135deg, #f8dfea, #b8849a)', width: '100%', height: '100%' }}></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {banners.length > 1 && (
            <>
              <button className="slide-nav-btn prev" onClick={prevSlide} aria-label="Slide trước">
                <ChevronLeft size={24} />
              </button>
              <button className="slide-nav-btn next" onClick={nextSlide} aria-label="Slide sau">
                <ChevronRight size={24} />
              </button>

              <div className="slide-dots">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Chuyển tới slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <section className="features">
        <div><Sparkles /><h3>Dịch vụ cao cấp</h3><p>Liệu trình chăm sóc đa dạng, phù hợp nhiều nhu cầu.</p></div>
        <div><CalendarCheck /><h3>Đặt lịch nhanh</h3><p>Chọn ngày, giờ, dịch vụ và chuyên viên dễ dàng.</p></div>
        <div><ShieldCheck /><h3>Quản lý rõ ràng</h3><p>Theo dõi trạng thái lịch hẹn, hóa đơn và đánh giá.</p></div>
        <div><HeartPulse /><h3>Chăm sóc tận tâm</h3><p>Lưu lịch sử sử dụng dịch vụ và ghi chú khách hàng.</p></div>
      </section>

      <section className="section-head">
        <span className="eyebrow">Dịch vụ thịnh hành</span>
        <h2>Dịch Vụ Hot Được Yêu Thích Nhất</h2>
      </section>
      <div className="service-grid">
        {hotServices.map((service) => <ServiceCard key={service.id} service={service} />)}
      </div>

      <section className="section-head" style={{ marginTop: '48px' }}>
        <span className="eyebrow">Trải nghiệm mới</span>
        <h2>Dịch Vụ Mới Nhất</h2>
      </section>
      <div className="service-grid">
        {latestServices.map((service) => <ServiceCard key={service.id} service={service} />)}
      </div>
    </div>
  );
}
