import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { appointmentApi } from '../api/appointmentApi';
import { reviewApi } from '../api/reviewApi';
import ErrorBox from '../components/ErrorBox';
import Loading from '../components/Loading';
import { dateText, money, serviceOfAppointment, statusClass, statusText } from '../utils/format';

export default function AppointmentDetail() {
  const { id } = useParams();
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

  const sendReview = async () => {
    setError('');
    setMessage('');
    const service = serviceOfAppointment(appointment);
    if (!service?.id || !appointment?.customer?.id) return setError('Lịch hẹn chưa có đủ thông tin dịch vụ hoặc khách hàng để đánh giá.');
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

  return (
    <div className="page narrow">
      <ErrorBox message={error} />
      {message && <div className="success-box">{message}</div>}
      <div className="detail-panel">
        <span className="eyebrow">Chi tiết lịch hẹn #{appointment.id}</span>
        <h1>{service?.name || 'Dịch vụ Spa'}</h1>
        <div className="info-list">
          <p><b>Khách hàng:</b> {appointment.customer?.fullName || 'Khách hàng'}</p>
          <p><b>Nhân viên:</b> {appointment.employee?.fullName || 'Spa tự chọn'}</p>
          <p><b>Phòng:</b> {appointment.room?.roomName || 'Spa tự chọn'}</p>
          <p><b>Ngày hẹn:</b> {dateText(appointment.appointmentDate)}</p>
          <p><b>Giờ hẹn:</b> {appointment.appointmentTime}</p>
          <p><b>Giá dịch vụ:</b> {money(service?.price)}</p>
          <p><b>Trạng thái:</b> <span className={`badge ${statusClass(appointment.status)}`}>{statusText(appointment.status)}</span></p>
          <p><b>Ghi chú:</b> {appointment.note || 'Không có'}</p>
        </div>
        <Link className="btn ghost" to="/appointments">Quay lại lịch sử</Link>
      </div>

      {appointment.status === 'HOAN_THANH' && (
        <div className="review-form">
          <h2>Đánh giá dịch vụ</h2>
          <label>Số sao
            <select value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })}>
              <option value="5">5 sao</option><option value="4">4 sao</option><option value="3">3 sao</option><option value="2">2 sao</option><option value="1">1 sao</option>
            </select>
          </label>
          <label>Nhận xét
            <textarea value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="Cảm nhận của bạn về dịch vụ..." />
          </label>
          <button className="btn solid" onClick={sendReview}>Gửi đánh giá</button>
        </div>
      )}
    </div>
  );
}
