import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appointmentApi } from '../api/appointmentApi';
import { customerApi } from '../api/customerApi';
import ErrorBox from '../components/ErrorBox';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { dateText, serviceOfAppointment, statusClass, statusText } from '../utils/format';

export default function AppointmentHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return navigate('/login');
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const keyword = user.phone || user.email || user.fullName;
        const customers = keyword ? await customerApi.search(keyword) : [];
        const customer = Array.isArray(customers) ? customers[0] : null;
        if (!customer?.id) {
          setAppointments([]);
          return;
        }
        const data = await appointmentApi.getByCustomer(customer.id);
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Không tải được lịch sử đặt lịch.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  const cancelAppointment = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return;
    try {
      const updated = await appointmentApi.updateStatus(id, 'DA_HUY');
      setAppointments((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError(err.message || 'Hủy lịch thất bại.');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page">
      <section className="section-head center">
        <span className="eyebrow">Lịch sử đặt lịch</span>
        <h1>Theo dõi trạng thái lịch hẹn của bạn</h1>
        <p>Trang này gọi API: <b>GET /api/appointments/customer/{'{customerId}'}</b>.</p>
      </section>
      <ErrorBox message={error} />
      <div className="table-card">
        <table>
          <thead>
            <tr><th>Mã</th><th>Dịch vụ</th><th>Nhân viên</th><th>Ngày</th><th>Giờ</th><th>Trạng thái</th><th>Hành động</th></tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? <tr><td colSpan="7" className="empty">Chưa có lịch hẹn nào.</td></tr> : appointments.map((item) => {
              const service = serviceOfAppointment(item);
              return (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>{service?.name || 'Dịch vụ Spa'}</td>
                  <td>{item.employee?.fullName || 'Spa tự chọn'}</td>
                  <td>{dateText(item.appointmentDate)}</td>
                  <td>{item.appointmentTime}</td>
                  <td><span className={`badge ${statusClass(item.status)}`}>{statusText(item.status)}</span></td>
                  <td className="row-actions">
                    <Link className="btn ghost small" to={`/appointments/${item.id}`}>Chi tiết</Link>
                    {['DANG_CHO', 'DA_XAC_NHAN'].includes(item.status) && <button className="btn danger small" onClick={() => cancelAppointment(item.id)}>Hủy</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
