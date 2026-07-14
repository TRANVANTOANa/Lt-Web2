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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!user) return navigate('/login');
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const keyword = user.phone || user.email || user.fullName;
        const customers = keyword ? await customerApi.search(keyword) : [];
        if (!customers || customers.length === 0) {
          setAppointments([]);
          return;
        }
        const appointmentPromises = customers.map(c => appointmentApi.getByCustomer(c.id).catch(() => []));
        const results = await Promise.all(appointmentPromises);
        const mergedAppointments = results.flat().sort((a, b) => b.id - a.id);
        
        // Remove duplicates if any appointment is fetched twice
        const uniqueAppointments = Array.from(new Map(mergedAppointments.map(item => [item.id, item])).values());
        setAppointments(uniqueAppointments);
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

  // Pagination calculations
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = appointments.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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
            {appointments.length === 0 ? (
              <tr><td colSpan="7" className="empty">Chưa có lịch hẹn nào.</td></tr>
            ) : (
              currentItems.map((item) => {
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
                      {['DANG_CHO', 'DA_XAC_NHAN'].includes(item.status) && (
                        <button className="btn danger small" onClick={() => cancelAppointment(item.id)}>Hủy</button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="page-btn text-btn" 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              &laquo; Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                className={`page-btn ${currentPage === number ? 'active' : ''}`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}
            <button 
              className="page-btn text-btn" 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Sau &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
