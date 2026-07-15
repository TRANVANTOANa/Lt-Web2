import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Clock, Star, ThumbsUp, Camera, User } from 'lucide-react';
import { serviceApi } from '../api/serviceApi';
import { reviewApi } from '../api/reviewApi';
import ErrorBox from '../components/ErrorBox';
import Loading from '../components/Loading';
import ServiceCard from '../components/ServiceCard';
import axiosClient from '../api/axiosClient';
import { mockServices } from '../data/mockData';
import { money, getServiceImage, dateText } from '../utils/format';

const imageHost = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8080';

const StarBar = ({ count, total, star }) => {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <span style={{ fontSize: '13px', color: '#888', width: '18px', textAlign: 'right' }}>{star}</span>
      <Star size={12} fill="#ffc107" color="#ffc107" />
      <div style={{ flex: 1, height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #ffc107, #ff9800)', borderRadius: '4px', transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: '12px', color: '#aaa', width: '28px' }}>{count}</span>
    </div>
  );
};

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedServices, setRelatedServices] = useState([]);
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

        let relatedList = [];
        if (data.category?.id) {
          try {
            relatedList = await serviceApi.getByCategory(data.category.id);
          } catch (err) {
            relatedList = [];
          }
        }

        let filtered = (relatedList || []).filter((s) => String(s.id) !== String(id));

        if (filtered.length === 0) {
          try {
            const activeList = await serviceApi.getActive();
            filtered = (activeList || []).filter((s) => String(s.id) !== String(id));
          } catch (err) {
            filtered = [];
          }
        }

        let promoList = [];
        try {
          const promos = await axiosClient.get('/promotions/active');
          promoList = Array.isArray(promos) ? promos : [];
        } catch (err) {
          promoList = [];
        }

        const attached = filtered.map(svc => ({
          ...svc,
          promotions: promoList.filter(p =>
            (p.applicableServices || []).some(s => s.id === svc.id)
          )
        }));

        setRelatedServices(attached.slice(0, 4));
      } catch (err) {
        setError('Không tải được API chi tiết, đang hiển thị dữ liệu mẫu.');
        const fallbackService = mockServices.find((s) => String(s.id) === String(id)) || mockServices[0];
        setService(fallbackService);

        let filteredMock = mockServices.filter(
          (s) => String(s.id) !== String(fallbackService.id) &&
                 s.category?.name === fallbackService.category?.name
        );
        if (filteredMock.length === 0) {
          filteredMock = mockServices.filter((s) => String(s.id) !== String(fallbackService.id));
        }
        setRelatedServices(filteredMock.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loading />;
  if (!service) return <ErrorBox message="Không tìm thấy dịch vụ" />;

  const image = getServiceImage(service);

  // Tính toán tổng hợp điểm đánh giá
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
    : null;
  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => (r.rating || 0) === star).length,
  }));

  return (
    <div className="page detail-page">
      <ErrorBox message={error} />
      <div className="detail-card">
        <div className="detail-image" style={image ? { backgroundImage: `url(${image})` } : undefined}>{!image && <span>{service.category?.name || 'Spa'}</span>}</div>
        <div className="detail-content">
          <span className="eyebrow">{service.category?.name || 'Dịch vụ Spa'}</span>
          <h1>{service.name}</h1>
          <div className="meta-row">
            <span><Star size={18} fill="currentColor" /> {avgRating || service.rating || '4.9'}</span>
            <span><Clock size={18} /> {service.duration || 60} phút</span>
          </div>
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

      {/* ===== REVIEWS SECTION ===== */}
      <section className="reviews" style={{ marginTop: '40px' }}>
        {/* Header tổng quan */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          marginBottom: '28px', gap: '24px', flexWrap: 'wrap'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#2d2d2d' }}>Đánh giá khách hàng</h2>
            <p style={{ margin: '4px 0 0', color: '#888', fontSize: '14px' }}>
              {totalReviews > 0 ? `${totalReviews} đánh giá từ khách hàng thực tế` : 'Chưa có đánh giá nào'}
            </p>
          </div>

          {/* Điểm tổng quan dạng card */}
          {totalReviews > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '24px',
              background: 'linear-gradient(135deg, #fff9f0, #fff3e0)',
              padding: '20px 28px', borderRadius: '16px',
              border: '1px solid #ffe0b2', boxShadow: '0 2px 12px rgba(255,152,0,0.08)',
              flexWrap: 'wrap'
            }}>
              {/* Big score */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '52px', fontWeight: 800, color: '#ff9800', lineHeight: 1 }}>{avgRating}</div>
                <div style={{ color: '#ffc107', fontSize: '20px', margin: '6px 0 2px', letterSpacing: '3px' }}>
                  {'★'.repeat(Math.round(avgRating))}
                </div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>/ 5 điểm</div>
              </div>

              {/* Bar chart by star */}
              <div style={{ minWidth: '180px' }}>
                {starCounts.map(({ star, count }) => (
                  <StarBar key={star} star={star} count={count} total={totalReviews} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Danh sách đánh giá */}
        {totalReviews === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            background: '#fafafa', borderRadius: '16px', border: '2px dashed #f0e0d0'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
            <p style={{ color: '#aaa', margin: 0, fontSize: '15px' }}>Hãy là người đầu tiên đánh giá dịch vụ này!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map((review) => {
              const fullImgUrl = review.imageUrl
                ? (review.imageUrl.startsWith('http') ? review.imageUrl : `${imageHost}${review.imageUrl}`)
                : null;
              const initials = (review.customer?.fullName || 'K')[0].toUpperCase();
              const avatarColors = ['#e74c3c','#e67e22','#2ecc71','#3498db','#9b59b6','#1abc9c'];
              const avatarColor = avatarColors[review.id % avatarColors.length] || '#e67e22';

              return (
                <div key={review.id} style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  border: '1px solid #f5f0eb',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}>
                  {/* Header: avatar + tên + sao + ngày */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                    {/* Avatar circle */}
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: avatarColor, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: '#fff', fontWeight: 700,
                      fontSize: '18px', flexShrink: 0
                    }}>
                      {initials}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                        <strong style={{ fontSize: '15px', color: '#2d2d2d' }}>
                          {review.customer?.fullName || 'Khách hàng'}
                        </strong>
                        <span style={{ fontSize: '12px', color: '#bbb' }}>{dateText(review.createdAt)}</span>
                      </div>

                      {/* Dịch vụ badge */}
                      {review.service?.name && (
                        <span style={{
                          display: 'inline-block', fontSize: '11px', padding: '2px 10px',
                          background: '#fdf0e8', color: '#e67e22', borderRadius: '20px',
                          border: '1px solid #fde0c0', marginTop: '4px', fontWeight: 500
                        }}>
                          {review.service.name}
                        </span>
                      )}

                      {/* Stars dịch vụ */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={16}
                            fill={s <= (review.rating || 0) ? '#ffc107' : 'none'}
                            color={s <= (review.rating || 0) ? '#ffc107' : '#ddd'}
                          />
                        ))}
                        <span style={{ fontSize: '13px', color: '#888', marginLeft: '4px' }}>({review.rating}/5)</span>
                      </div>
                    </div>
                  </div>

                  {/* Comment dịch vụ */}
                  {review.comment && (
                    <p style={{
                      margin: '0 0 14px',
                      color: '#555', lineHeight: 1.65, fontSize: '14px',
                      paddingLeft: '58px'
                    }}>
                      {review.comment}
                    </p>
                  )}

                  {/* Nhận xét KTV */}
                  {(review.employeeRating || review.employeeComment) && (
                    <div style={{
                      marginLeft: '58px', padding: '12px 16px',
                      background: 'linear-gradient(135deg, #fff9f0, #fff3e0)',
                      borderRadius: '10px', borderLeft: '3px solid #ff9f43',
                      fontSize: '13px', marginBottom: '14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <User size={14} color="#e67e22" />
                        <span style={{ fontWeight: 600, color: '#e67e22', fontSize: '12px' }}>
                          KTV: {review.employee?.fullName || 'Nhân viên Spa'}
                        </span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={12}
                              fill={s <= (review.employeeRating || 0) ? '#ffc107' : 'none'}
                              color={s <= (review.employeeRating || 0) ? '#ffc107' : '#ddd'}
                            />
                          ))}
                        </div>
                      </div>
                      {review.employeeComment && (
                        <p style={{ margin: 0, color: '#777', fontStyle: 'italic' }}>"{review.employeeComment}"</p>
                      )}
                    </div>
                  )}

                  {/* Hình ảnh thực tế */}
                  {fullImgUrl && (
                    <div style={{ marginLeft: '58px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ position: 'relative' }}>
                        <img
                          src={fullImgUrl}
                          alt="Ảnh thực tế"
                          style={{
                            width: '120px', height: '120px', objectFit: 'cover',
                            borderRadius: '10px', border: '2px solid #f0e4d8',
                            cursor: 'pointer', transition: 'transform 0.2s',
                          }}
                          onMouseOver={e => e.target.style.transform = 'scale(1.04)'}
                          onMouseOut={e => e.target.style.transform = 'scale(1)'}
                        />
                        <div style={{
                          position: 'absolute', bottom: '6px', right: '6px',
                          background: 'rgba(0,0,0,0.45)', borderRadius: '50%',
                          padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Camera size={12} color="#fff" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Helpful indicator */}
                  <div style={{ marginLeft: '58px', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ThumbsUp size={13} color="#ccc" />
                    <span style={{ fontSize: '12px', color: '#ccc' }}>Đánh giá hữu ích</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== RELATED SERVICES SECTION ===== */}
      {relatedServices.length > 0 && (
        <>
          <hr style={{ border: '0', height: '1px', background: 'linear-gradient(90deg, transparent, var(--line) 50%, transparent)', margin: '64px 0' }} />
          <section className="related-services" style={{ marginBottom: '40px' }}>
            <div className="section-head center">
              <span className="eyebrow">Khám phá thêm</span>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#4a3840', margin: '10px 0 0' }}>Dịch vụ liên quan</h2>
              <p style={{ color: '#8a7580', marginTop: '6px' }}>Các liệu trình chăm sóc sắc đẹp và sức khỏe phù hợp khác tại Spa</p>
            </div>
            <div className="service-grid">
              {relatedServices.map((svc) => (
                <ServiceCard key={svc.id} service={svc} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
