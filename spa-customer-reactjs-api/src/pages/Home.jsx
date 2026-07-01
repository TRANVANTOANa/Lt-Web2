import { Link } from 'react-router-dom';
import { CalendarCheck, HeartPulse, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { serviceApi } from '../api/serviceApi';
import ServiceCard from '../components/ServiceCard';
import { mockServices } from '../data/mockData';

export default function Home() {
  const [services, setServices] = useState(mockServices);

  useEffect(() => {
    serviceApi.getActive()
      .then((data) => setServices((data?.length ? data : mockServices).slice(0, 4)))
      .catch(() => setServices(mockServices));
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-text">
          <span className="eyebrow">Spa chăm sóc sắc đẹp</span>
          <h1>Thư giãn cơ thể, làm đẹp làn da, phục hồi năng lượng mỗi ngày</h1>
          <p>Đặt lịch nhanh, chọn dịch vụ yêu thích, theo dõi lịch hẹn và hóa đơn ngay trên website.</p>
          <div className="hero-actions">
            <Link className="btn solid big" to="/booking">Đặt lịch ngay</Link>
            <Link className="btn ghost big" to="/services">Xem dịch vụ</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-flower">✦</div>
          <h3>Serene Bloom</h3>
          <p>Không gian trị liệu nhẹ nhàng, chuyên viên tận tâm và quy trình chăm sóc chuyên nghiệp.</p>
        </div>
      </section>

      <section className="features">
        <div><Sparkles /><h3>Dịch vụ cao cấp</h3><p>Liệu trình chăm sóc đa dạng, phù hợp nhiều nhu cầu.</p></div>
        <div><CalendarCheck /><h3>Đặt lịch nhanh</h3><p>Chọn ngày, giờ, dịch vụ và chuyên viên dễ dàng.</p></div>
        <div><ShieldCheck /><h3>Quản lý rõ ràng</h3><p>Theo dõi trạng thái lịch hẹn, hóa đơn và đánh giá.</p></div>
        <div><HeartPulse /><h3>Chăm sóc tận tâm</h3><p>Lưu lịch sử sử dụng dịch vụ và ghi chú khách hàng.</p></div>
      </section>

      <section className="section-head">
        <span className="eyebrow">Dịch vụ nổi bật</span>
        <h2>Liệu trình được yêu thích</h2>
      </section>
      <div className="service-grid">
        {services.map((service) => <ServiceCard key={service.id} service={service} />)}
      </div>
    </div>
  );
}
