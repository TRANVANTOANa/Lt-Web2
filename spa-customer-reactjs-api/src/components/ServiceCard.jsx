import { Clock, Star, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getServiceImage, money } from '../utils/format';

export default function ServiceCard({ service }) {
  const image = getServiceImage(service);
  const promotions = service.promotions || [];
  const bestPromo = promotions[0]; // lấy khuyến mãi đầu tiên (active)

  // Tính giá sau giảm
  let discountedPrice = null;
  if (bestPromo) {
    if (bestPromo.discountType === 'PERCENT') {
      discountedPrice = service.price * (1 - bestPromo.discountValue / 100);
    } else if (bestPromo.discountType === 'AMOUNT') {
      discountedPrice = Math.max(0, service.price - bestPromo.discountValue);
    }
  }

  return (
    <article className="service-card">
      <Link to={`/services/${service.id}`} className="service-image" style={image ? { backgroundImage: `url(${image})` } : undefined}>
        {!image && <span>{service?.category?.name || 'Spa'}</span>}
        <b><Star size={15} fill="currentColor" /> {service.rating || '4.9'}</b>

        {/* Badge khuyến mãi */}
        {bestPromo && (
          <span className="promo-badge">
            <Tag size={11} />
            {bestPromo.discountType === 'PERCENT'
              ? `-${bestPromo.discountValue}%`
              : `-${money(bestPromo.discountValue)}`}
          </span>
        )}
      </Link>
      <div className="service-body">
        <div className="service-head">
          <h3>{service.name}</h3>
          <div className="price-block">
            {discountedPrice !== null ? (
              <>
                <strong className="price-new">{money(discountedPrice)}</strong>
                <span className="price-old">{money(service.price)}</span>
              </>
            ) : (
              <strong>{money(service.price)}</strong>
            )}
          </div>
        </div>
        <p className="muted"><Clock size={16} /> {service.duration || 60} phút</p>
        <p>{service.description || 'Dịch vụ chăm sóc sức khỏe và sắc đẹp chuyên nghiệp.'}</p>
        {bestPromo && (
          <p className="promo-label">
            <Tag size={13} /> {bestPromo.name} — mã: <b>{bestPromo.code}</b>
          </p>
        )}
        <div className="card-actions">
          <Link className="btn ghost" to={`/services/${service.id}`}>Chi tiết</Link>
          <Link className="btn solid" to={`/booking/${service.id}`}>Đặt lịch</Link>
        </div>
      </div>
    </article>
  );
}
