import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import { serviceApi } from '../api/serviceApi';
import { reviewApi } from '../api/reviewApi';
import ErrorBox from '../components/ErrorBox';
import Loading from '../components/Loading';
import { mockServices } from '../data/mockData';
import { money, getServiceImage, dateText } from '../utils/format';

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await serviceApi.getById(id);
        setService(data);
        reviewApi.getByService(id).then(setReviews).catch(() => setReviews([]));
      } catch (err) {
        setError('Không tải được API chi tiết, đang hiển thị dữ liệu mẫu.');
        setService(mockServices.find((s) => String(s.id) === String(id)) || mockServices[0]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loading />;
  if (!service) return <ErrorBox message="Không tìm thấy dịch vụ" />;

  const image = getServiceImage(service);

  return (
    <div className="page detail-page">
      <ErrorBox message={error} />
      <div className="detail-card">
        <div className="detail-image" style={image ? { backgroundImage: `url(${image})` } : undefined}>{!image && <span>{service.category?.name || 'Spa'}</span>}</div>
        <div className="detail-content">
          <span className="eyebrow">{service.category?.name || 'Dịch vụ Spa'}</span>
          <h1>{service.name}</h1>
          <div className="meta-row"><span><Star size={18} fill="currentColor" /> {service.rating || '4.9'}</span><span><Clock size={18} /> {service.duration || 60} phút</span></div>
          <h2>{money(service.price)}</h2>
          <p>{service.description || 'Dịch vụ chăm sóc sắc đẹp chuyên nghiệp với quy trình tận tâm.'}</p>
          <ul className="check-list">
            <li>Làm sạch, thư giãn và phục hồi năng lượng.</li>
            <li>Chuyên viên tư vấn liệu trình phù hợp.</li>
            <li>Có thể đặt lịch trực tuyến và theo dõi trạng thái.</li>
          </ul>
          <Link className="btn solid big" to={`/booking/${service.id}`}>Đặt lịch ngay</Link>
        </div>
      </div>

      <section className="reviews">
        <h2>Đánh giá khách hàng</h2>
        {reviews.length === 0 ? <p className="muted">Chưa có đánh giá cho dịch vụ này.</p> : reviews.map((review) => (
          <div className="review-item" key={review.id}>
            <strong>{review.customer?.fullName || 'Khách hàng'}</strong>
            <span>{'★'.repeat(review.rating || 5)} · {dateText(review.createdAt)}</span>
            <p>{review.comment}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
