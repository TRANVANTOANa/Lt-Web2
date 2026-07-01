import { Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getServiceImage, money } from '../utils/format';

export default function ServiceCard({ service }) {
  const image = getServiceImage(service);
  return (
    <article className="service-card">
      <Link to={`/services/${service.id}`} className="service-image" style={image ? { backgroundImage: `url(${image})` } : undefined}>
        {!image && <span>{service?.category?.name || 'Spa'}</span>}
        <b><Star size={15} fill="currentColor" /> {service.rating || '4.9'}</b>
      </Link>
      <div className="service-body">
        <div className="service-head">
          <h3>{service.name}</h3>
          <strong>{money(service.price)}</strong>
        </div>
        <p className="muted"><Clock size={16} /> {service.duration || 60} phút</p>
        <p>{service.description || 'Dịch vụ chăm sóc sức khỏe và sắc đẹp chuyên nghiệp.'}</p>
        <div className="card-actions">
          <Link className="btn ghost" to={`/services/${service.id}`}>Chi tiết</Link>
          <Link className="btn solid" to={`/booking/${service.id}`}>Đặt lịch</Link>
        </div>
      </div>
    </article>
  );
}
