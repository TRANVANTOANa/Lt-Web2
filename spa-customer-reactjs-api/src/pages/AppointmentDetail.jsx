import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { appointmentApi } from '../api/appointmentApi';
import { reviewApi } from '../api/reviewApi';
import ErrorBox from '../components/ErrorBox';
import Loading from '../components/Loading';
import { dateText, money, serviceOfAppointment, statusText } from '../utils/format';
import { Star, User, Send, CheckCircle2, Flower2, ArrowLeft } from 'lucide-react';

export default function AppointmentDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [appointment, setAppointment] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentApi.getById(id)
      .then(setAppointment)
      .catch((err) => setError(err.message || 'Không tải được chi tiết lịch hẹn.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment');
    if (paymentStatus === 'success') {
      setMessage('Thanh toán thành công qua cổng VNPay! Cảm ơn quý khách.');
    } else if (paymentStatus === 'fail') {
      setError('Thanh toán qua cổng VNPay không thành công hoặc đã bị hủy.');
    }
  }, [location.search]);

  const sendReview = async () => {
    setError('');
    setMessage('');
    const service = serviceOfAppointment(appointment);
    if (!service?.id || !appointment?.customer?.id) {
      return setError('Lịch hẹn chưa có đủ thông tin dịch vụ hoặc khách hàng để đánh giá.');
    }
    try {
      await reviewApi.create({
        customer: { id: appointment.customer.id },
        service: { id: service.id },
        rating: Number(review.rating),
        comment: review.comment,
      });
      setMessage('Gửi đánh giá thành công.');
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      setError(err.message || 'Gửi đánh giá thất bại.');
    }
  };

  if (loading) return <Loading />;
  if (!appointment) return <div className="page"><ErrorBox message={error || 'Không tìm thấy lịch hẹn.'} /></div>;

  const service = serviceOfAppointment(appointment);

  const calculateEndTime = (startTime, durationMinutes) => {
    if (!startTime) return '';
    const parts = startTime.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) return startTime;
    
    const totalMinutes = hours * 60 + minutes + (durationMinutes || 60);
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
  };

  const formatAppointmentId = (id) => {
    if (!id) return '';
    return `#SB-2026-${String(id).padStart(4, '0')}`;
  };

  const renderStatusBadge = (status) => {
    const text = statusText(status);
    if (status === 'HOAN_THANH') {
      return (
        <span className="badge-custom success">
          <CheckCircle2 size={14} />
          {text}
        </span>
      );
    }
    if (['DA_XAC_NHAN', 'DA_THANH_TOAN', 'ACTIVE'].includes(status)) {
      return (
        <span className="badge-custom success">
          <CheckCircle2 size={14} />
          {text}
        </span>
      );
    }
    if (['DA_HUY', 'KHACH_KHONG_DEN', 'INACTIVE'].includes(status)) {
      return (
        <span className="badge-custom danger">
          {text}
        </span>
      );
    }
    if (['DANG_THUC_HIEN'].includes(status)) {
      return (
        <span className="badge-custom info">
          {text}
        </span>
      );
    }
    return (
      <span className="badge-custom warning">
        {text}
      </span>
    );
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`star-btn-custom ${i <= review.rating ? 'filled' : ''}`}
          onClick={() => setReview({ ...review, rating: i })}
        >
          <Star size={28} fill={i <= review.rating ? 'currentColor' : 'none'} />
        </button>
      );
    }
    return stars;
  };

  const getServicesLabel = () => {
    if (appointment?.note && appointment.note.includes('[Dịch vụ đặt:')) {
      const match = appointment.note.match(/\[Dịch vụ đặt:\s*([^\]]+)\]/);
      if (match && match[1]) {
        return match[1];
      }
    }
    return service?.name || 'Dịch vụ Spa';
  };

  return (
    <div className="appointment-detail-container">
      <div className="detail-header">
        <h1>Chi tiết lịch hẹn</h1>
        <p>Xem lại thông tin chi tiết về buổi trải nghiệm của bạn tại Spa Beauty.</p>
      </div>

      {error && <ErrorBox message={error} />}
      {message && <div className="success-box">{message}</div>}

      <div className="detail-grid">
        {/* Left column */}
        <div className="detail-main-col">
          {/* Appointment Information Card */}
          <div className="detail-card-custom">
            <div className="card-header-row">
              <h2>Mã lịch hẹn: {formatAppointmentId(appointment.id)}</h2>
              {renderStatusBadge(appointment.status)}
            </div>
            <p className="booking-date-sub">
              Ngày đặt: {dateText(appointment.createdAt || appointment.appointmentDate)}
            </p>
            <hr className="divider-line" />
            
            <div className="info-grid-2x2">
              <div className="info-item-box">
                <span className="info-item-label">Dịch vụ</span>
                <span className="info-item-value">
                  {getServicesLabel()}{' '}
                  {appointment.duration || service?.duration ? `(${appointment.duration || service?.duration} Phút)` : ''}
                </span>
              </div>
              <div className="info-item-box">
                <span className="info-item-label">Thời gian</span>
                <span className="info-item-value">
                  {formatTime(appointment.appointmentTime)} -{' '}
                  {calculateEndTime(appointment.appointmentTime, appointment.duration || service?.duration)},{' '}
                  {dateText(appointment.appointmentDate)}
                </span>
              </div>
              <div className="info-item-box">
                <span className="info-item-label">Chuyên viên</span>
                <div className="therapist-info-value">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop" 
                    alt="Therapist" 
                    className="therapist-avatar" 
                  />
                  <span>{appointment.employee?.fullName || 'Spa tự chọn'}</span>
                </div>
              </div>
              <div className="info-item-box">
                <span className="info-item-label">Tổng tiền</span>
                <span className="info-item-value">
                  {money(appointment.price || service?.price).replace('đ', ' VNĐ')}
                </span>
              </div>
            </div>
          </div>

          {/* Service Rating Card (Only shown when Completed) */}
          {appointment.status === 'HOAN_THANH' && (
            <div className="detail-card-custom">
              <div className="review-card-title-section">
                <h3>Đánh giá dịch vụ</h3>
                <p>Chia sẻ trải nghiệm của bạn để chúng tôi phục vụ tốt hơn.</p>
              </div>
              
              <div className="star-rating-container">
                {renderStars()}
              </div>
              
              <textarea
                className="textarea-custom"
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                placeholder="Nhập nhận xét của bạn về dịch vụ, không gian, nhân viên..."
              />
              
              <button className="btn-submit-review" onClick={sendReview}>
                Gửi đánh giá <Send size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="detail-sidebar-col">
          {/* Customer Info Card */}
          <div className="detail-card-custom">
            <h3 className="sidebar-card-title">
              <User size={20} />
              Thông tin khách hàng
            </h3>
            <div className="sidebar-list">
              <div className="sidebar-item">
                <span className="sidebar-label">Họ và tên</span>
                <span className="sidebar-value">
                  {appointment.customer?.fullName || appointment.fullName || 'Khách hàng'}
                </span>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-label">Số điện thoại</span>
                <span className="sidebar-value">
                  {appointment.customer?.phone || 'Chưa cung cấp'}
                </span>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-label">Email</span>
                <span className="sidebar-value">
                  {appointment.customer?.email || 'Chưa cung cấp'}
                </span>
              </div>
            </div>
          </div>

          {/* Spa Info Card */}
          <div className="detail-card-custom">
            <h3 className="sidebar-card-title">
              <Flower2 size={20} />
              Thông tin Spa
            </h3>
            <div className="sidebar-list">
              <div className="sidebar-item">
                <span className="sidebar-label">Chi nhánh</span>
                <span className="sidebar-value">Spa Beauty Quận 1</span>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-label">Địa chỉ</span>
                <span className="sidebar-value">
                  123 Wellness Way, P. Bến Nghé, Quận 1, TP. HCM
                </span>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-label">Hotline chi nhánh</span>
                <span className="sidebar-value">0123-456-789</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="back-link-container">
        <Link className="btn ghost" to="/appointments">
          <ArrowLeft size={16} /> Quay lại lịch sử
        </Link>
      </div>
    </div>
  );
}
