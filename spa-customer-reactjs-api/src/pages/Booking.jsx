import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
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
import { Check, User, Search } from 'lucide-react';

const defaultForm = {
  serviceIds: [], // Cho phép lưu nhiều ID dịch vụ đã chọn
  serviceId: '',
  employeeId: '',
  roomId: '',
  appointmentDate: '',
  appointmentTime: '',
  fullName: '',
  phone: '',
  email: '',
  note: '',
  paymentMethod: 'TIEN_MAT', // Mặc định thanh toán tại quầy
};

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
];

const STEPS = [
  { id: 1, name: 'Dịch vụ' },
  { id: 2, name: 'Thời gian' },
  { id: 3, name: 'Chọn phòng' },
  { id: 4, name: 'Nhân viên' },
  { id: 5, name: 'Thông tin' },
  { id: 6, name: 'Xác nhận' }
];

export default function Booking() {
  const { serviceId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  
  // State lịch (Calendar)
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  useEffect(() => {
    const initialServiceIds = serviceId ? [String(serviceId)] : [];
    setForm((prev) => ({
      ...prev,
      serviceIds: initialServiceIds,
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
        const [serviceData, employeeData, roomData, promoData] = await Promise.all([
          serviceApi.getAll(),
          employeeApi.getActive(),
          roomApi.getAvailable(),
          axiosClient.get('/promotions/active').catch(() => []),
        ]);
        const promos = Array.isArray(promoData) ? promoData : [];
        const enrichedServices = (serviceData?.length ? serviceData : mockServices).map(svc => ({
          ...svc,
          promotions: promos.filter(p =>
            (p.applicableServices || []).some(s => s.id === svc.id)
          )
        }));
        setServices(enrichedServices);
        setEmployees(employeeData?.length ? employeeData : mockEmployees);
        setRooms(roomData?.length ? roomData : mockRooms);
        
        // Tự động chọn phòng đầu tiên làm mặc định nếu có
        const initialRooms = roomData?.length ? roomData : mockRooms;
        if (initialRooms.length > 0) {
          setForm(prev => ({ ...prev, roomId: String(initialRooms[0].id) }));
        }
      } catch (err) {
        setError('Không kết nối được API, đang hiển thị dữ liệu mẫu. Khi đặt lịch cần bật Spring Boot.');
        setServices(mockServices);
        setEmployees(mockEmployees);
        setRooms(mockRooms);
        if (mockRooms.length > 0) {
          setForm(prev => ({ ...prev, roomId: String(mockRooms[0].id) }));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Lấy các dịch vụ đã được chọn
  const selectedServices = useMemo(() => {
    return services.filter((s) => form.serviceIds?.includes(String(s.id)));
  }, [services, form.serviceIds]);

  const selectedEmployee = useMemo(() => employees.find((e) => String(e.id) === String(form.employeeId)), [employees, form.employeeId]);
  const selectedRoom = useMemo(() => rooms.find((r) => String(r.id) === String(form.roomId)), [rooms, form.roomId]);

  // Tính tổng chi phí và tổng thời gian thực hiện
  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
  }, [selectedServices]);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + (s.duration || 60), 0);
  }, [selectedServices]);

  const applyPromo = async () => {
    setPromoError('');
    if (!promoCode.trim()) return;
    try {
      const code = promoCode.trim().toUpperCase();
      const checkRes = await axiosClient.get(`/promotions/check/${code}`);
      if (!checkRes.valid) {
        setPromoError('Mã khuyến mãi không hợp lệ hoặc đã hết hạn.');
        return;
      }
      const promo = await axiosClient.get(`/promotions/code/${code}`);
      setAppliedPromo(promo);
    } catch (err) {
      setPromoError('Mã khuyến mãi không tồn tại hoặc đã hết hạn.');
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setAppliedPromo(null);
    setPromoError('');
  };

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discountType === 'PERCENT') {
      return (totalPrice * (appliedPromo.discountValue || 0)) / 100;
    }
    return appliedPromo.discountValue || 0;
  }, [totalPrice, appliedPromo]);

  const finalPrice = useMemo(() => {
    const res = totalPrice - discountAmount;
    return res < 0 ? 0 : res;
  }, [totalPrice, discountAmount]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const lastSelectedIdsRef = useRef('');
  useEffect(() => {
    const currentIdsStr = (form.serviceIds || []).sort().join(',');
    if (lastSelectedIdsRef.current !== currentIdsStr) {
      lastSelectedIdsRef.current = currentIdsStr;
      const serviceWithPromo = selectedServices.find(s => s.promotions && s.promotions.length > 0);
      if (serviceWithPromo) {
        const bestPromo = serviceWithPromo.promotions[0];
        setAppliedPromo(bestPromo);
        setPromoCode(bestPromo.code);
      } else {
        setAppliedPromo(null);
        setPromoCode('');
      }
    }
  }, [selectedServices, form.serviceIds]);

  // Xử lý bật/tắt dịch vụ khi người dùng click
  const toggleService = (sId) => {
    setForm((prev) => {
      const currentIds = prev.serviceIds || [];
      const newIds = currentIds.includes(String(sId))
        ? currentIds.filter((id) => id !== String(sId))
        : [...currentIds, String(sId)];
      return {
        ...prev,
        serviceIds: newIds,
        serviceId: newIds[0] || '', // Fallback cho phần tử đầu tiên
      };
    });
  };

  // Xử lý bộ lịch động
  const handlePrevMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const daysInMonth = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDayDate = new Date(year, month, 1);
    const firstDayOfWeek = firstDayDate.getDay(); 
    const startDayOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // 0: Thứ 2, 6: Chủ nhật
    
    const days = [];
    for (let i = 0; i < startDayOffset; i++) {
      days.push(null);
    }
    
    const totalDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [calendarMonth]);

  const isPastDay = (date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const getMonthName = (date) => {
    return `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
  };

  // Ánh xạ ảnh động từ Unsplash dựa trên loại dịch vụ (Để giao diện luôn có ảnh mẫu đẹp)
  const getServiceDetails = (service, index) => {
    const name = service?.name?.toLowerCase() || '';
    const idx = index % 4;
    const images = [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=300&auto=format&fit=crop'
    ];
    return {
      image: images[idx],
      duration: service?.duration || [60, 90, 75, 45][idx],
    };
  };

  // Ánh xạ ảnh phòng động theo mô tả trong ảnh mẫu
  const getRoomDetails = (room, index) => {
    const name = room?.roomName || '';
    const desc = room?.description || '';
    const rawImage = room?.image || '';

    const imageHost = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8080';
    const finalImage = rawImage 
      ? (rawImage.startsWith('http') ? rawImage : `${imageHost}${rawImage}`)
      : '';

    const idx = index % 3;
    if (idx === 0) {
      return {
        name: name || 'Phòng VIP Orchid',
        badge: 'VIP Orchid',
        desc: desc || 'Không gian riêng tư, nến thơm, âm nhạc nhẹ nhàng và bồn tắm thảo dược cao cấp.',
        image: finalImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop'
      };
    }
    if (idx === 1) {
      return {
        name: name || 'Phòng Lotus Single',
        badge: 'Còn trống',
        desc: desc || 'Không gian tối giản, yên tĩnh tuyệt đối, lý tưởng cho liệu trình cá nhân chuyên sâu.',
        image: finalImage || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop'
      };
    }
    return {
      name: name || 'Phòng Jasmine Double',
      badge: 'Còn trống',
      desc: desc || 'Phòng đôi rộng rãi, hương lài dịu nhẹ, thích hợp cho các cặp đôi hoặc bạn bè.',
      image: finalImage || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=400&auto=format&fit=crop'
    };
  };

  // Ánh xạ nhân viên động theo ảnh mẫu
  const getEmployeeDetails = (employee, index) => {
    const idx = index % 2;
    const avatars = [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=150&auto=format&fit=crop'
    ];
    const ratings = [
      '★ 4.9 (120 đánh giá)',
      '★ 4.8 (95 đánh giá)'
    ];
    const positions = [
      'Kỹ thuật viên cao cấp',
      'Chuyên gia Da liễu'
    ];
    return {
      avatar: avatars[idx],
      rating: ratings[idx],
      position: positions[idx]
    };
  };

  // Điều hướng các bước
  const nextStep = () => {
    setError('');
    if (currentStep === 1 && (!form.serviceIds || form.serviceIds.length === 0)) return setError('Vui lòng chọn ít nhất một dịch vụ.');
    if (currentStep === 2 && (!form.appointmentDate || !form.appointmentTime)) return setError('Vui lòng chọn ngày và giờ hẹn.');
    if (currentStep === 3 && !form.roomId) return setError('Vui lòng chọn phòng.');
    if (currentStep === 5 && (!form.fullName || !form.phone)) return setError('Vui lòng điền họ tên và số điện thoại.');
    
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

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

  const submitBooking = async () => {
    setError('');
    setSuccess('');
    setSaving(true);
    
    try {
      const duration = totalDuration; // Sử dụng tổng thời gian của tất cả dịch vụ
      if (selectedEmployee?.id) {
        const conflict = await appointmentApi.checkEmployeeConflict({
          employeeId: selectedEmployee.id,
          date: form.appointmentDate,
          time: form.appointmentTime.length === 5 ? `${form.appointmentTime}:00` : form.appointmentTime,
          duration,
        });
        if (conflict?.conflict === true) throw new Error('Nhân viên đã có lịch ở thời gian này.');
      }
      if (selectedRoom?.id) {
        const conflict = await appointmentApi.checkRoomConflict({
          roomId: selectedRoom.id,
          date: form.appointmentDate,
          time: form.appointmentTime.length === 5 ? `${form.appointmentTime}:00` : form.appointmentTime,
          duration,
        });
        if (conflict?.conflict === true) throw new Error('Phòng đã có lịch ở thời gian này.');
      }

      // Xây dựng chuỗi ghi chú chứa danh sách tất cả các dịch vụ đã chọn
      const servicesLabel = selectedServices.map(s => `${s.name} (${s.duration}p)`).join(', ');
      const listNote = `[Dịch vụ đặt: ${servicesLabel}]`;
      const finalNote = form.note ? `${listNote}\n${form.note}` : listNote;

      const customer = await findOrCreateCustomer();
      const payload = {
        customer: { id: customer.id },
        employee: selectedEmployee?.id ? { id: selectedEmployee.id } : null,
        room: selectedRoom?.id ? { id: selectedRoom.id } : null,
        promotion: appliedPromo ? { id: appliedPromo.id } : null,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime.length === 5 ? `${form.appointmentTime}:00` : form.appointmentTime,
        status: 'DANG_CHO',
        note: finalNote,
        price: finalPrice,
        duration: totalDuration,
        paymentMethod: form.paymentMethod,
        appointmentDetails: selectedServices.map((s) => ({
          service: { id: Number(s.id) },
          price: Number(s.price || 0),
          duration: Number(s.duration || 60),
          note: finalNote,
        })),
      };
      
      const created = await appointmentApi.create(payload);

      // Nếu người dùng chọn thanh toán online qua VNPay
      if (form.paymentMethod === 'VNPAY') {
        const res = await axiosClient.get('/vnpay/create-payment', {
          params: { appointmentId: created.id, amount: finalPrice }
        });
        if (res && res.paymentUrl) {
          window.location.href = res.paymentUrl;
          return;
        } else {
          throw new Error('Không tạo được liên kết thanh toán VNPay.');
        }
      }

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
    <div className="page">
      <section className="section-head center">
        <span className="eyebrow">Spa Beauty</span>
        <h1>Đặt Lịch Hẹn</h1>
        <p>Hãy dành thời gian chăm sóc bản thân tại không gian thư giãn của chúng tôi.</p>
      </section>

      <div className="booking-wizard-container">
        {/* Thanh Tiến Trình (Steps Progressbar) */}
        <div className="steps-progressbar">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className={`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                <div className="step-circle">
                  {isCompleted ? <Check size={16} /> : step.id}
                </div>
                <span className="step-label">{step.name}</span>
              </div>
            );
          })}
        </div>

        <ErrorBox message={error} />
        {success && <div className="success-box">{success}</div>}

        {/* NỘI DUNG TỪNG BƯỚC */}
        
        {/* BƯỚC 1: CHỌN DỊCH VỤ */}
        {currentStep === 1 && (
          <div className="booking-step-content animate-fade-in">
            <h3 className="wizard-title">Chọn Dịch Vụ Của Bạn</h3>
            <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '20px', fontSize: '14px' }}>
              Bạn có thể chọn một hoặc nhiều dịch vụ cùng lúc.
            </p>
            <div className="service-select-grid">
              {services.map((s, index) => {
                const details = getServiceDetails(s, index);
                const isSelected = form.serviceIds?.includes(String(s.id));
                const bestPromo = s.promotions && s.promotions[0];
                let discountedPrice = null;
                if (bestPromo) {
                  if (bestPromo.discountType === 'PERCENT') {
                    discountedPrice = s.price * (1 - bestPromo.discountValue / 100);
                  } else if (bestPromo.discountType === 'AMOUNT') {
                    discountedPrice = Math.max(0, s.price - bestPromo.discountValue);
                  }
                }
                return (
                  <div 
                    key={s.id} 
                    className={`service-select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleService(s.id)}
                  >
                    <img className="service-card-img" src={details.image} alt={s.name} />
                    <div className="service-card-info">
                      <h4>{s.name}</h4>
                      <p>{details.duration} Phút</p>
                    </div>
                    <div className="service-card-price" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', minWidth: '70px' }}>
                      {discountedPrice !== null ? (
                        <>
                          <span style={{ fontWeight: 700, color: '#9c27b0' }}>
                            {money(discountedPrice).replace(' VNĐ', '').replace('.000', 'k').replace('đ', '')}
                          </span>
                          <span style={{ textDecoration: 'line-through', fontSize: '11px', color: 'var(--muted)' }}>
                            {money(s.price).replace(' VNĐ', '').replace('.000', 'k').replace('đ', '')}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontWeight: 700 }}>
                          {money(s.price).replace(' VNĐ', '').replace('.000', 'k').replace('đ', '')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="wizard-actions single-btn">
              <button className="btn solid big" disabled={!form.serviceIds || form.serviceIds.length === 0} onClick={nextStep}>
                Tiếp Tục
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 2: CHỌN THỜI GIAN */}
        {currentStep === 2 && (
          <div className="booking-step-content animate-fade-in">
            <h3 className="wizard-title">Chọn Thời Gian Hẹn</h3>
            <div className="calendar-time-layout">
              {/* Lịch custom */}
              <div className="custom-calendar">
                <div className="calendar-header">
                  <button type="button" onClick={handlePrevMonth}>&lt; Trước</button>
                  <h4>{getMonthName(calendarMonth)}</h4>
                  <button type="button" onClick={handleNextMonth}>Sau &gt;</button>
                </div>
                <div className="calendar-days-header">
                  <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                </div>
                <div className="calendar-grid">
                  {daysInMonth.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} />;
                    const formatted = formatDate(day);
                    const isSelected = form.appointmentDate === formatted;
                    const isDisabled = isPastDay(day);
                    return (
                      <button
                        key={formatted}
                        type="button"
                        disabled={isDisabled}
                        className={`calendar-day-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => update('appointmentDate', formatted)}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Khung giờ trống */}
              <div className="time-slots-container">
                <h4>Khung giờ trống</h4>
                <div className="time-slots-grid">
                  {TIME_SLOTS.map((time) => {
                    const isSelected = form.appointmentTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        className={`time-slot-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => update('appointmentTime', time)}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="wizard-actions">
              <button className="btn ghost big" onClick={prevStep}>Quay Lại</button>
              <button className="btn solid big" disabled={!form.appointmentDate || !form.appointmentTime} onClick={nextStep}>
                Tiếp Tục
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 3: CHỌN PHÒNG */}
        {currentStep === 3 && (
          <div className="booking-step-content animate-fade-in">
            <h3 className="wizard-title">Chọn Phòng Thực Hiện</h3>
            <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '30px' }}>
              Tận hưởng không gian thư giãn được thiết kế riêng biệt để đánh thức mọi giác quan của bạn.
            </p>
            <div className="room-selection-grid">
              {rooms.map((r, index) => {
                const details = getRoomDetails(r, index);
                const isSelected = String(form.roomId) === String(r.id);
                return (
                  <div 
                    key={r.id} 
                    className={`room-select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => update('roomId', String(r.id))}
                  >
                    <div className="room-card-img-wrapper">
                      <img className="room-card-img" src={details.image} alt={details.name} />
                      <div className={`room-card-badge ${details.badge.includes('VIP') ? 'vip' : ''}`}>
                        {details.badge}
                      </div>
                      <div className="room-card-status-badge">Còn trống</div>
                    </div>
                    <div className="room-card-body">
                      <h4>{details.name}</h4>
                      <p>{details.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="wizard-actions">
              <button className="btn ghost big" onClick={prevStep}>Quay Lại</button>
              <button className="btn solid big" disabled={!form.roomId} onClick={nextStep}>
                Tiếp Tục
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 4: CHỌN NHÂN VIÊN */}
        {currentStep === 4 && (
          <div className="booking-step-content animate-fade-in">
            <h3 className="wizard-title">Chọn Nhân Viên Thực Hiện</h3>
            <div className="employee-selection-grid">
              {employees.map((e, index) => {
                const details = getEmployeeDetails(e, index);
                const isSelected = String(form.employeeId) === String(e.id);
                return (
                  <div 
                    key={e.id} 
                    className={`employee-select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => update('employeeId', String(e.id))}
                  >
                    <img src={details.avatar} alt={e.fullName} />
                    <h4>{e.fullName}</h4>
                    <p>{details.position === 'LE_TAN' ? 'Lễ tân' : (details.position === 'QUAN_LY' ? 'Quản lý' : 'Kỹ thuật viên')}</p>
                    <span>{details.rating}</span>
                  </div>
                );
              })}
              
              {/* Thẻ chọn ngẫu nhiên */}
              <div 
                className={`employee-select-card random-card ${!form.employeeId ? 'selected' : ''}`}
                onClick={() => update('employeeId', '')}
              >
                <div className="random-icon-wrapper">
                  <User size={32} />
                </div>
                <h4>Chọn ngẫu nhiên</h4>
                <p style={{ margin: 0 }}>Hệ thống tự sắp xếp</p>
              </div>
            </div>
            <div className="wizard-actions">
              <button className="btn ghost big" onClick={prevStep}>Quay Lại</button>
              <button className="btn solid big" onClick={nextStep}>Tiếp Tục</button>
            </div>
          </div>
        )}

        {/* BƯỚC 5: THÔNG TIN KHÁCH HÀNG */}
        {currentStep === 5 && (
          <div className="booking-step-content animate-fade-in">
            <h3 className="wizard-title">Thông Tin Liên Hệ</h3>
            <div className="contact-step-form">
              <div className="form-grid" style={{ gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
                <label>Họ và Tên *
                  <input 
                    value={form.fullName} 
                    onChange={(e) => update('fullName', e.target.value)} 
                    placeholder="Nhập họ tên của bạn" 
                    required 
                  />
                </label>
                <label>Số điện thoại *
                  <input 
                    value={form.phone} 
                    onChange={(e) => update('phone', e.target.value)} 
                    placeholder="Nhập số điện thoại" 
                    required 
                  />
                </label>
                <label>Email
                  <input 
                    value={form.email} 
                    onChange={(e) => update('email', e.target.value)} 
                    placeholder="Nhập địa chỉ email" 
                  />
                </label>
                <label>Ghi chú (Tùy chọn)
                  <textarea 
                    value={form.note} 
                    onChange={(e) => update('note', e.target.value)} 
                    placeholder="Bạn có yêu cầu đặc biệt nào không?" 
                  />
                </label>
              </div>
            </div>
            <div className="wizard-actions">
              <button className="btn ghost big" onClick={prevStep}>Quay Lại</button>
              <button className="btn solid big" disabled={!form.fullName || !form.phone} onClick={nextStep}>
                Tiếp Tục
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 6: XÁC NHẬN ĐẶT LỊCH */}
        {currentStep === 6 && (
          <div className="booking-step-content animate-fade-in">
            <h3 className="wizard-title">Xác Nhận Thông Tin Đặt Lịch</h3>
            
            <div className="booking-summary-card">
              <div className="summary-title">
                <h3>Tóm Tắt Đặt Lịch</h3>
              </div>
              <div className="summary-details-box">
                <div className="summary-section">
                  <h4>Thông tin dịch vụ</h4>
                  <div className="summary-row" style={{ flexDirection: 'column', gap: '4px', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span>Dịch vụ đã chọn:</span>
                    <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', marginTop: '4px' }}>
                      {selectedServices.map((s, idx) => (
                        <span key={s.id} style={{ fontWeight: 700, color: 'var(--text)', fontSize: '13px' }}>
                          {idx + 1}. {s.name} ({s.duration} phút) - {money(s.price)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="summary-row">
                    <span>Thời gian:</span>
                    <span>{form.appointmentTime}, {formatDisplayDate(form.appointmentDate)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tổng thời gian:</span>
                    <span>{totalDuration} phút</span>
                  </div>
                  <div className="summary-row">
                    <span>Nhân viên:</span>
                    <span>{selectedEmployee?.fullName || 'Hệ thống chọn ngẫu nhiên'}</span>
                  </div>
                  <div className="summary-row">
                    <span>Phòng:</span>
                    <span>{selectedRoom?.roomName || 'Tự động chọn'}</span>
                  </div>
                </div>

                <div className="summary-section">
                  <h4>Thông tin khách hàng</h4>
                  <div className="summary-row">
                    <span>Họ tên:</span>
                    <span>{form.fullName}</span>
                  </div>
                  <div className="summary-row">
                    <span>Số điện thoại:</span>
                    <span>{form.phone}</span>
                  </div>
                  {form.email && (
                    <div className="summary-row">
                      <span>Email:</span>
                      <span>{form.email}</span>
                    </div>
                  )}
                </div>

                {/* Phương thức thanh toán */}
                <div className="summary-section">
                  <h4>Phương thức thanh toán</h4>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700 }}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="TIEN_MAT" 
                        checked={form.paymentMethod === 'TIEN_MAT'} 
                        onChange={(e) => update('paymentMethod', e.target.value)} 
                        style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
                      />
                      Thanh toán tại quầy
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700 }}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="VNPAY" 
                        checked={form.paymentMethod === 'VNPAY'} 
                        onChange={(e) => update('paymentMethod', e.target.value)} 
                        style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
                      />
                      Thanh toán VNPay
                    </label>
                  </div>
                </div>

                {/* Mã khuyến mãi */}
                <div className="summary-section" style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                  <h4>Mã khuyến mãi</h4>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', marginBottom: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Nhập mã giảm giá..." 
                      value={promoCode} 
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={!!appliedPromo}
                      style={{ flex: 1, textTransform: 'uppercase', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)' }}
                    />
                    {appliedPromo ? (
                      <button 
                        type="button" 
                        className="btn danger small" 
                        onClick={removePromo}
                        style={{ borderRadius: '8px', padding: '8px 16px' }}
                      >
                        Gỡ bỏ
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        className="btn solid small" 
                        onClick={applyPromo}
                        style={{ borderRadius: '8px', padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none' }}
                      >
                        Áp dụng
                      </button>
                    )}
                  </div>
                  {promoError && <p style={{ color: '#af3939', fontSize: '12px', marginTop: '4px', margin: 0 }}>{promoError}</p>}
                  {appliedPromo && (
                    <p style={{ color: '#247a47', fontSize: '13px', marginTop: '4px', margin: 0, fontWeight: 600 }}>
                      Đã áp dụng: {appliedPromo.name} (Giảm {appliedPromo.discountType === 'PERCENT' ? `${appliedPromo.discountValue}%` : money(appliedPromo.discountValue)})
                    </p>
                  )}
                </div>

                <div className="summary-section" style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                  {appliedPromo && (
                    <div className="summary-row" style={{ marginBottom: '6px' }}>
                      <span>Tạm tính:</span>
                      <span>{money(totalPrice)}</span>
                    </div>
                  )}
                  {appliedPromo && (
                    <div className="summary-row" style={{ marginBottom: '6px', color: '#af3939' }}>
                      <span>Giảm giá:</span>
                      <span>-{money(discountAmount)}</span>
                    </div>
                  )}
                  <div className="summary-row" style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Tổng cộng:</span>
                    <span className="summary-total">{money(finalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' }}>
              Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
            </p>

            <div className="wizard-actions">
              <button className="btn ghost big" onClick={prevStep}>Quay Lại</button>
              <button className="btn solid big" style={{ backgroundColor: '#6f555e', borderColor: '#6f555e' }} disabled={saving} onClick={submitBooking}>
                {saving ? 'Đang đặt lịch...' : 'Xác Nhận Đặt Lịch'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
