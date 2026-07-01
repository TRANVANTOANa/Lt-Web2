import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { appointmentApi } from '../api/appointmentApi';
import { customerApi } from '../api/customerApi';
import { employeeApi } from '../api/employeeApi';
import { roomApi } from '../api/roomApi';
import { serviceApi } from '../api/serviceApi';
import ErrorBox from '../components/ErrorBox';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { mockEmployees, mockRooms, mockServices } from '../data/mockData';
import { money } from '../utils/format';

const defaultForm = {
  serviceId: '',
  employeeId: '',
  roomId: '',
  appointmentDate: '',
  appointmentTime: '09:00',
  fullName: '',
  phone: '',
  email: '',
  note: '',
};

export default function Booking() {
  const { serviceId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      serviceId: serviceId || prev.serviceId,
      fullName: user?.fullName || prev.fullName,
      phone: user?.phone || prev.phone,
      email: user?.email || prev.email,
    }));
  }, [serviceId, user]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [serviceData, employeeData, roomData] = await Promise.all([
          serviceApi.getAll(),
          employeeApi.getActive(),
          roomApi.getAvailable(),
        ]);
        setServices(serviceData?.length ? serviceData : mockServices);
        setEmployees(employeeData?.length ? employeeData : mockEmployees);
        setRooms(roomData?.length ? roomData : mockRooms);
      } catch (err) {
        setError('Không kết nối được API, đang hiển thị dữ liệu mẫu. Khi đặt lịch cần bật Spring Boot.');
        setServices(mockServices);
        setEmployees(mockEmployees);
        setRooms(mockRooms);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selectedService = useMemo(() => services.find((s) => String(s.id) === String(form.serviceId)), [services, form.serviceId]);
  const selectedEmployee = useMemo(() => employees.find((e) => String(e.id) === String(form.employeeId)), [employees, form.employeeId]);
  const selectedRoom = useMemo(() => rooms.find((r) => String(r.id) === String(form.roomId)) || rooms[0], [rooms, form.roomId]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const findOrCreateCustomer = async () => {
    const keyword = form.phone || form.email || form.fullName;
    if (keyword) {
      try {
        const results = await customerApi.search(keyword);
        const found = Array.isArray(results) ? results.find((c) => c.phone === form.phone || c.email === form.email) || results[0] : null;
        if (found?.id) return found;
      } catch (_) {}
    }
    return customerApi.create({
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      customerType: 'THUONG',
      note: form.note,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!selectedService) return setError('Vui lòng chọn dịch vụ.');
    if (!form.appointmentDate || !form.appointmentTime) return setError('Vui lòng chọn ngày và giờ hẹn.');
    if (!form.fullName || !form.phone) return setError('Vui lòng nhập họ tên và số điện thoại.');

    setSaving(true);
    try {
      const duration = selectedService.duration || 60;
      if (selectedEmployee?.id) {
        const conflict = await appointmentApi.checkEmployeeConflict({
          employeeId: selectedEmployee.id,
          date: form.appointmentDate,
          time: form.appointmentTime.length === 5 ? `${form.appointmentTime}:00` : form.appointmentTime,
          duration,
        });
        if (conflict === true) throw new Error('Nhân viên đã có lịch ở thời gian này.');
      }
      if (selectedRoom?.id) {
        const conflict = await appointmentApi.checkRoomConflict({
          roomId: selectedRoom.id,
          date: form.appointmentDate,
          time: form.appointmentTime.length === 5 ? `${form.appointmentTime}:00` : form.appointmentTime,
          duration,
        });
        if (conflict === true) throw new Error('Phòng đã có lịch ở thời gian này.');
      }

      const customer = await findOrCreateCustomer();
      const payload = {
        customer: { id: customer.id },
        employee: selectedEmployee?.id ? { id: selectedEmployee.id } : null,
        room: selectedRoom?.id ? { id: selectedRoom.id } : null,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime.length === 5 ? `${form.appointmentTime}:00` : form.appointmentTime,
        status: 'DANG_CHO',
        note: form.note,
        appointmentDetails: [
          {
            service: { id: selectedService.id },
            price: selectedService.price,
            duration: selectedService.duration || 60,
            note: form.note,
          },
        ],
      };
      const created = await appointmentApi.create(payload);
      setSuccess('Đặt lịch thành công, vui lòng chờ Spa xác nhận.');
      setTimeout(() => navigate(`/appointments/${created?.id || ''}`), 700);
    } catch (err) {
      setError(err.message || 'Đặt lịch thất bại. Kiểm tra Spring Boot API và dữ liệu liên quan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page narrow">
      <section className="section-head center">
        <span className="eyebrow">Đặt lịch Spa</span>
        <h1>Chọn dịch vụ, thời gian và thông tin khách hàng</h1>
        <p>Form này gọi API: <b>POST /api/customers</b> và <b>POST /api/appointments</b>.</p>
      </section>

      <ErrorBox message={error} />
      {success && <div className="success-box">{success}</div>}

      <form className="booking-form" onSubmit={submit}>
        <div className="form-grid">
          <label>Dịch vụ
            <select value={form.serviceId} onChange={(e) => update('serviceId', e.target.value)}>
              <option value="">Chọn dịch vụ</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name} - {money(s.price)}</option>)}
            </select>
          </label>
          <label>Nhân viên
            <select value={form.employeeId} onChange={(e) => update('employeeId', e.target.value)}>
              <option value="">Chọn tự động</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.fullName}</option>)}
            </select>
          </label>
          <label>Phòng
            <select value={form.roomId} onChange={(e) => update('roomId', e.target.value)}>
              <option value="">Chọn tự động</option>
              {rooms.map((r) => <option key={r.id} value={r.id}>{r.roomName}</option>)}
            </select>
          </label>
          <label>Ngày hẹn
            <input type="date" value={form.appointmentDate} onChange={(e) => update('appointmentDate', e.target.value)} />
          </label>
          <label>Giờ hẹn
            <input type="time" value={form.appointmentTime} onChange={(e) => update('appointmentTime', e.target.value)} />
          </label>
          <label>Họ tên
            <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Nguyễn Văn A" />
          </label>
          <label>Số điện thoại
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="0909..." />
          </label>
          <label>Email
            <input value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="email@gmail.com" />
          </label>
        </div>
        <label>Ghi chú
          <textarea value={form.note} onChange={(e) => update('note', e.target.value)} placeholder="Yêu cầu thêm, tình trạng sức khỏe, dị ứng..." />
        </label>
        <div className="booking-summary">
          <h3>Thông tin đặt lịch</h3>
          <p>Dịch vụ: <b>{selectedService?.name || 'Chưa chọn'}</b></p>
          <p>Giá: <b>{selectedService ? money(selectedService.price) : '0đ'}</b></p>
          <p>Nhân viên: <b>{selectedEmployee?.fullName || 'Spa tự chọn'}</b></p>
          <p>Phòng: <b>{selectedRoom?.roomName || 'Spa tự chọn'}</b></p>
        </div>
        <button className="btn solid big full" disabled={saving}>{saving ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}</button>
      </form>
    </div>
  );
}
