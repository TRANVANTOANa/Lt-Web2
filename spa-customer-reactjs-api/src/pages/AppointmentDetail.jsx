import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { appointmentApi } from '../api/appointmentApi';
import { reviewApi } from '../api/reviewApi';
import axiosClient from '../api/axiosClient';
import ErrorBox from '../components/ErrorBox';
import Loading from '../components/Loading';
import { dateText, money, serviceOfAppointment, statusText } from '../utils/format';
import { Star, User, Send, CheckCircle2, Flower2, ArrowLeft, Upload, Camera } from 'lucide-react';

export default function AppointmentDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [appointment, setAppointment] = useState(null);
  const [existingReviews, setExistingReviews] = useState([]);
  const [review, setReview] = useState({
    rating: 5, comment: '',
    employeeRating: 5, employeeComment: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      appointmentApi.getById(id),
      reviewApi.getByAppointment(id).catch(() => [])
    ])
      .then(([appData, reviewsData]) => {
        setAppointment(appData);
        setExistingReviews(reviewsData || []);
      })
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const sendReview = async () => {
    setError('');
    setMessage('');
    if (!appointment?.customer?.id) {
      return setError('Lịch hẹn chưa có đủ thông tin khách hàng để đánh giá.');
    }

    // Collect all services from appointmentDetails
    const details = Array.isArray(appointment?.appointmentDetails) ? appointment.appointmentDetails : [];
    const allServices = details.map(d => d?.service).filter(Boolean);
    if (allServices.length === 0) {
      const svc = serviceOfAppointment(appointment);
      if (svc?.id) allServices.push(svc);
    }
    if (allServices.length === 0) {
      return setError('Lịch hẹn chưa có thông tin dịch vụ để đánh giá.');
    }

    setSubmitting(true);
    try {
      // Upload image if provided
      let uploadedImageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const res = await axiosClient.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedImageUrl = typeof res === 'string' ? res : res?.url || res?.data || null;
      }

      // Send one review per service
      const submittedReviews = [];
      for (const svc of allServices) {
        const created = await reviewApi.create({
          customer: { id: appointment.customer.id },
          service: { id: svc.id },
          employee: appointment.employee?.id ? { id: appointment.employee.id } : null,
          appointment: { id: appointment.id },
          rating: Number(review.rating),
          comment: review.comment,
          employeeRating: Number(review.employeeRating),
          employeeComment: review.employeeComment,
          imageUrl: uploadedImageUrl,
        });
        submittedReviews.push(created);
      }
      setExistingReviews(submittedReviews);
      setMessage(`Gửi đánh giá thành công cho ${allServices.length} dịch vụ!`);
      setReview({ rating: 5, comment: '', employeeRating: 5, employeeComment: '' });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.message || 'Gửi đánh giá thất bại.');
    } finally {
      setSubmitting(false);
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

  const renderStars = (field = 'rating') => {
    const currentVal = review[field] || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`star-btn-custom ${i <= currentVal ? 'filled' : ''}`}
          onClick={() => setReview({ ...review, [field]: i })}
        >
          <Star size={28} fill={i <= currentVal ? 'currentColor' : 'none'} />
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
                <span className="info-item-value" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  {money(appointment.price || service?.price).replace('đ', ' VNĐ')}
                  <span className={`badge ${appointment?.invoice?.paymentStatus === 'DA_THANH_TOAN' ? 'success' : 'danger'}`} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px' }}>
                    {appointment?.invoice?.paymentStatus === 'DA_THANH_TOAN' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Review Card (Show existing reviews if already submitted, otherwise show review form) */}
          {appointment.status === 'HOAN_THANH' && (
            existingReviews.length > 0 ? (
              <div className="detail-card-custom" style={{ padding: '28px 24px', background: '#fff', borderRadius: '16px', border: '1px dashed #ffa8a8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: '#fdf5f0', padding: '10px', borderRadius: '50%', color: '#ff6b6b' }}>
                    <Flower2 size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Đánh giá của bạn</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Cảm ơn quý khách đã gửi ý kiến đóng góp!</p>
                  </div>
                </div>

                {existingReviews.map((rev, idx) => {
                  const imageHost = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8080';
                  const fullImgUrl = rev.imageUrl 
                    ? (rev.imageUrl.startsWith('http') ? rev.imageUrl : `${imageHost}${rev.imageUrl}`) 
                    : null;

                  return (
                    <div key={rev.id || idx} style={{ marginBottom: idx < existingReviews.length - 1 ? '20px' : 0, paddingBottom: idx < existingReviews.length - 1 ? '20px' : 0, borderBottom: idx < existingReviews.length - 1 ? '1px solid #f2f2f2' : 'none' }}>
                      <p style={{ fontWeight: 600, color: '#e67e22', fontSize: '14px', marginBottom: '8px' }}>
                        Dịch vụ: {rev.service?.name || 'Dịch vụ Spa'}
                      </p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Rating dịch vụ */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 500, color: '#555' }}>Đánh giá dịch vụ:</span>
                            <span style={{ color: '#ffc107', fontSize: '14px', letterSpacing: '1px' }}>{'★'.repeat(rev.rating || 5)}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '13px', color: '#666', fontStyle: 'italic' }}>"{rev.comment || 'Không có bình luận.'}"</p>
                        </div>

                        {/* Rating KTV */}
                        {(rev.employeeRating || rev.employeeComment) && (
                          <div style={{ padding: '10px 14px', background: '#fdf8f5', borderRadius: '8px', borderLeft: '3px solid #ff9f43' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 600, color: '#e67e22' }}>Nhân viên ({rev.employee?.fullName || 'Spa tự chọn'}):</span>
                              <span style={{ color: '#ffc107', fontSize: '12px' }}>{'★'.repeat(rev.employeeRating || 5)}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '12px', color: '#666', fontStyle: 'italic' }}>"{rev.employeeComment || 'Không có bình luận.'}"</p>
                          </div>
                        )}

                        {/* Hình ảnh */}
                        {fullImgUrl && (
                          <div style={{ marginTop: '8px' }}>
                            <img src={fullImgUrl} alt="Ảnh đánh giá" style={{ maxWidth: '180px', maxHeight: '180px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #eaeaea' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="detail-card-custom" style={{ padding: '28px 24px' }}>
                <div className="review-card-title-section" style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontStyle: 'italic', fontSize: '22px' }}>Chia sẻ cảm nhận</h3>
                  <p>Góp ý của bạn giúp chúng tôi hoàn thiện dịch vụ mỗi ngày.</p>
                </div>

                {/* --- Đánh giá Dịch vụ --- */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Flower2 size={18} /> Đánh giá Dịch vụ
                    </span>
                    <div className="star-rating-container" style={{ margin: 0 }}>
                      {renderStars('rating')}
                    </div>
                  </div>
                  <textarea
                    className="textarea-custom"
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                    placeholder="Cảm nhận của bạn về chất lượng liệu trình, không gian phòng, âm nhạc..."
                    style={{ minHeight: '80px' }}
                  />
                </div>

                {/* --- Đánh giá Kỹ thuật viên --- */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={18} /> Đánh giá Kỹ thuật viên
                    </span>
                    <div className="star-rating-container" style={{ margin: 0 }}>
                      {renderStars('employeeRating')}
                    </div>
                  </div>
                  <textarea
                    className="textarea-custom"
                    value={review.employeeComment}
                    onChange={(e) => setReview({ ...review, employeeComment: e.target.value })}
                    placeholder={`Nhận xét về thái độ phục vụ và kỹ năng của ${appointment.employee?.fullName || 'kỹ thuật viên'}...`}
                    style={{ minHeight: '80px' }}
                  />
                </div>

                {/* --- Hình ảnh thực tế --- */}
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <Camera size={18} /> Hình ảnh thực tế (Tùy chọn)
                  </span>
                  <label style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '10px 18px', borderRadius: '10px',
                    border: '2px dashed #ccc', cursor: 'pointer',
                    color: '#888', fontSize: '14px', transition: 'border-color 0.2s',
                  }}>
                    <Upload size={18} />
                    Tải ảnh
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                  {imagePreview && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '10px', border: '1px solid #eee' }} />
                    </div>
                  )}
                </div>

                {message && <p style={{ color: '#2ecc71', fontSize: '14px', margin: '8px 0', fontWeight: 500 }}>{message}</p>}
                {error && <p style={{ color: '#e74c3c', fontSize: '14px', margin: '8px 0' }}>{error}</p>}

                <button className="btn-submit-review" onClick={sendReview} disabled={submitting} style={{ marginTop: '4px' }}>
                  {submitting ? 'Đang gửi...' : 'Gửi Đánh Giá'} <Send size={16} />
                </button>
              </div>
            )
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
