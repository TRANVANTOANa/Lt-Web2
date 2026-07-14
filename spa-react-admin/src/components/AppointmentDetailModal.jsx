import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient.js';
import { money } from '../utils/constants.js';
import StatusBadge from './StatusBadge.jsx';

export default function AppointmentDetailModal({ row, onClose, onUpdateStatus, onOpenEdit }) {
  if (!row) return null;

  const [invoice, setInvoice] = useState(row.invoice || null);

  useEffect(() => {
    axiosClient.get(`/appointments/${row.id}`)
      .then(res => {
        if (res && res.invoice) {
          setInvoice(res.invoice);
        }
      })
      .catch(err => console.error(err));
  }, [row.id]);

  const handlePayAtCounter = async () => {
    if (!invoice || !invoice.id) return;
    if (!window.confirm('Xác nhận khách hàng đã thanh toán bằng tiền mặt tại quầy?')) return;
    try {
      const updatedInvoice = await axiosClient.put(`/invoices/${invoice.id}/payment`, {
        paymentMethod: 'TIEN_MAT'
      });
      if (updatedInvoice) {
        setInvoice(updatedInvoice);
        alert('Xác nhận thanh toán thành công!');
        // Refresh parent list
        if (onUpdateStatus && row.status) {
          let rawStatus = row.status;
          if (row.status === 'PENDING') rawStatus = 'DANG_CHO';
          else if (row.status === 'CONFIRMED') rawStatus = 'DA_XAC_NHAN';
          else if (row.status === 'IN_PROGRESS') rawStatus = 'DANG_THUC_HIEN';
          else if (row.status === 'COMPLETED') rawStatus = 'HOAN_THANH';
          else if (row.status === 'CANCELLED') rawStatus = 'DA_HUY';
          onUpdateStatus(rawStatus);
        }
      }
    } catch (err) {
      alert('Lỗi thanh toán: ' + (err.message || err));
    }
  };

  // Retrieve customer/employee/service details safely
  const customer = row.customer || {};
  const employee = row.employee || {};
  const room = row.room || {};
  const service = row.service || {};

  // Formatted date and times
  const formattedDate = row.appointmentDate ? row.appointmentDate.split('-').reverse().join('/') : '';
  const formattedTime = row.startTime || (row.appointmentTime ? row.appointmentTime.substring(0, 5) : '00:00');

  // Customer Badge Type
  const customerTypeLabel = (type) => {
    switch (type) {
      case 'VIP': return 'Khách hàng VIP';
      case 'THAN_THIET': return 'Khách hàng thân thiết';
      default: return 'Khách hàng mới';
    }
  };

  const getCustomerTypeClass = (type) => {
    switch (type) {
      case 'VIP': return 'vip-tag';
      case 'THAN_THIET': return 'loyal-tag';
      default: return 'new-tag';
    }
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 1100 }}>
      <div className="modal-box" style={{ maxWidth: '850px', width: '95%', padding: '28px', background: '#fff' }}>
        
        {/* Header Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#888' }}>
            <span>Lịch hẹn</span>
            <span>›</span>
            <span style={{ color: 'var(--pink)', fontWeight: 600 }}>Chi tiết #LH100{row.id}</span>
          </div>
          <button 
            onClick={onClose} 
            style={{ border: 'none', background: 'transparent', fontSize: '24px', cursor: 'pointer', color: '#bbb' }}
          >
            ×
          </button>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ cursor: 'pointer', color: 'var(--pink)' }} onClick={onClose}>←</span> Chi tiết lịch hẹn
        </h2>

        {/* Grid Layout (Two columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Customer Information Card */}
            <div style={{
              background: 'linear-gradient(135deg, #fff7fa, #fbf2ff)',
              borderRadius: '20px',
              padding: '24px',
              border: '1.5px solid rgba(232, 93, 140, 0.08)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150" 
                  alt="Customer" 
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                />
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: '800', color: 'var(--text)' }}>
                    {customer.fullName || row.customerName || 'Vãng lai'}
                  </h4>
                  <span style={{
                    fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '999px',
                    background: customer.customerType === 'VIP' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #e85d8c, #b999df)',
                    color: '#fff', display: 'inline-block', textTransform: 'uppercase'
                  }}>
                    {customerTypeLabel(customer.customerType)}
                  </span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px', fontSize: '13px' }}>
                <div>
                  <span style={{ display: 'block', color: '#998a92', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Số điện thoại</span>
                  <strong style={{ color: 'var(--text)' }}>📞 {customer.phone || 'Chưa cung cấp'}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', color: '#998a92', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Email</span>
                  <strong style={{ color: 'var(--text)', wordBreak: 'break-all' }}>✉️ {customer.email || 'Chưa cung cấp'}</strong>
                </div>
              </div>
            </div>

            {/* Service Details Card */}
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '24px',
              border: '1.5px solid var(--line)',
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '800', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🌸 Dịch vụ đăng ký
              </h3>
              
              <div style={{
                background: '#fff5f8',
                borderRadius: '16px',
                padding: '18px',
                border: '1px solid rgba(232, 93, 140, 0.05)',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '800', color: 'var(--text)' }}>
                      {service.name || row.serviceName || 'Trị liệu sắc đẹp'}
                    </h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#8c7d85', lineHeight: '1.4' }}>
                      {service.description || 'Liệu trình chăm sóc phục hồi sức khỏe chuyên sâu.'}
                    </p>
                  </div>
                  <strong style={{ fontSize: '16px', color: 'var(--pink)', whiteSpace: 'nowrap' }}>
                    {money(row.price || service.price)}
                  </strong>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', background: '#fff', border: '1px solid #f0dce6', padding: '6px 12px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    ⏱️ {row.duration || service.duration || 60} phút
                  </span>
                  <span style={{ fontSize: '12px', background: '#fff', border: '1px solid #f0dce6', padding: '6px 12px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    🔄 Lần thứ {row.id ? (row.id % 4) + 1 : 1}
                  </span>
                  {invoice && invoice.paymentStatus === 'CHUA_THANH_TOAN' ? (
                    <button
                      type="button"
                      onClick={handlePayAtCounter}
                      style={{
                        fontSize: '12px',
                        background: '#ffeef4',
                        border: '1.5px solid var(--pink)',
                        padding: '5px 12px',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 700,
                        color: 'var(--pink)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'var(--pink)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = '#ffeef4'; e.currentTarget.style.color = 'var(--pink)'; }}
                    >
                      💵 THANH TOÁN TẠI QUẦY
                    </button>
                  ) : invoice && invoice.paymentStatus === 'DA_THANH_TOAN' ? (
                    <span style={{ fontSize: '12px', background: '#e8f5e9', border: '1.5px solid #2e7d32', padding: '5px 12px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#2e7d32' }}>
                      ✅ ĐÃ THANH TOÁN TIỀN MẶT
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', background: '#ffeef4', border: '1px dashed var(--pink)', padding: '6px 12px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: 'var(--pink)' }}>
                      💵 THANH TOÁN TẠI QUẦY
                    </span>
                  )}
                </div>
              </div>

              {row.note && (
                <div style={{ background: '#fcfcfc', border: '1px solid #eee', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', fontStyle: 'italic', color: '#666' }}>
                  💡 Ghi chú từ khách: "{row.note}"
                </div>
              )}
            </div>

          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Allocation Card (KTV / Room) */}
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '24px',
              border: '1.5px solid var(--line)',
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '800', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                👤 Phân bổ lịch trình
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Employee / Therapist */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#fcfcfc', borderRadius: '14px', border: '1px solid #f0eef1' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#e8f1ff', display: 'grid', placeItems: 'center', fontSize: '20px' }}>
                    💆‍♀️
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '10px', color: '#aaa', fontWeight: 700, textTransform: 'uppercase' }}>Nhân viên thực hiện</span>
                    <strong style={{ fontSize: '14px', color: 'var(--text)' }}>
                      {employee.fullName || row.employeeName || 'Spa tự chọn'}
                    </strong>
                  </div>
                </div>

                {/* Room */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#fcfcfc', borderRadius: '14px', border: '1px solid #f0eef1' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fdf0e7', display: 'grid', placeItems: 'center', fontSize: '20px' }}>
                    🚪
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '10px', color: '#aaa', fontWeight: 700, textTransform: 'uppercase' }}>Phòng trị liệu</span>
                    <strong style={{ fontSize: '14px', color: 'var(--text)' }}>
                      {room.roomName || row.roomName || 'Đang sắp xếp'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline progression Card */}
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '24px',
              border: '1.5px solid var(--line)',
              flex: 1
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '800', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📈 Tiến độ lịch hẹn
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '24px', borderLeft: '2px solid #f0eef1', marginLeft: '10px' }}>
                
                {/* Step 1: Created */}
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-31px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--pink)', border: '2px solid #fff' }} />
                  <span style={{ fontSize: '11px', color: '#aaa', fontWeight: 700 }}>{formattedTime} - {formattedDate}</span>
                  <h4 style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>Đang chờ xử lý</h4>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#888' }}>Lịch hẹn được tạo thành công trên hệ thống</p>
                </div>

                {/* Step 2: Confirmed */}
                {['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(row.status) && (
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-31px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: '#4fa7e8', border: '2px solid #fff' }} />
                    <span style={{ fontSize: '11px', color: '#aaa', fontWeight: 700 }}>{formattedTime} - {formattedDate}</span>
                    <h4 style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>Đã xác nhận</h4>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#888' }}>Đã sắp xếp kỹ thuật viên và phòng thực hiện</p>
                  </div>
                )}

                {/* Step 3: Complete */}
                {row.status === 'COMPLETED' && (
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-31px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: '#54c785', border: '2px solid #fff' }} />
                    <span style={{ fontSize: '11px', color: '#aaa', fontWeight: 700 }}>{formattedTime} - {formattedDate}</span>
                    <h4 style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: 700, color: '#148a55' }}>Hoàn thành trị liệu</h4>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#888' }}>Cảm ơn quý khách đã tin tưởng Spa Beauty</p>
                  </div>
                )}

                {/* Cancelled Step */}
                {row.status === 'CANCELLED' && (
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-31px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: '#d93025', border: '2px solid #fff' }} />
                    <span style={{ fontSize: '11px', color: '#aaa', fontWeight: 700 }}>{formattedTime} - {formattedDate}</span>
                    <h4 style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: 700, color: '#d93025' }}>Đã hủy lịch hẹn</h4>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#888' }}>Lịch hẹn đã bị hủy do yêu cầu của khách hàng/hệ thống</p>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

        {/* Footer Buttons Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--line)',
          paddingTop: '20px',
          marginTop: '24px'
        }}>
          <div>
            <span style={{ color: '#aaa', fontSize: '12px' }}>Trạng thái hiện tại:</span>
            <div style={{ marginTop: '4px' }}>
              <StatusBadge status={row.status} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {row.status !== 'CANCELLED' && row.status !== 'COMPLETED' && (
              <button 
                type="button" 
                onClick={() => onUpdateStatus('CANCELLED')} 
                style={{ background: '#ffe7e5', color: '#d93025', border: 'none', borderRadius: '12px', padding: '10px 18px', fontWeight: 700, cursor: 'pointer' }}
              >
                ⊗ HỦY LỊCH
              </button>
            )}
            
            <button 
              type="button" 
              onClick={onOpenEdit} 
              style={{ background: '#f0e7ff', color: '#7c3aed', border: 'none', borderRadius: '12px', padding: '10px 18px', fontWeight: 700, cursor: 'pointer' }}
            >
              🖊️ SỬA LỊCH HẸN
            </button>

            {row.status !== 'COMPLETED' && row.status !== 'CANCELLED' && (
              <button 
                type="button" 
                onClick={() => onUpdateStatus('COMPLETED')} 
                style={{ background: 'linear-gradient(135deg, #5c448a, #4a3470)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 18px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(92, 68, 138, 0.25)' }}
              >
                ✓ XÁC NHẬN HOÀN THÀNH
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
