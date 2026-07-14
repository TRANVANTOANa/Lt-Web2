import React, { useState } from 'react';
import { fieldLabels } from '../utils/constants.js';
import axiosClient from '../api/axiosClient.js';

export default function Modal({ fields, initial, onClose, onSubmit, lookups }) {
  const [form, setForm] = useState(() => {
    if (initial) return { ...initial };
    const defaults = {};
    if (fields.includes('gender')) defaults.gender = 'Nam';
    if (fields.includes('customerType')) defaults.customerType = 'THUONG';
    if (fields.includes('position')) defaults.position = 'KY_THUAT';
    if (fields.includes('roleName')) defaults.roleName = 'ROLE_NHAN_VIEN';
    if (fields.includes('discountType')) defaults.discountType = 'PERCENT';
    if (fields.includes('paymentMethod')) defaults.paymentMethod = 'TIEN_MAT';
    if (fields.includes('paymentStatus')) defaults.paymentStatus = 'PENDING';
    if (fields.includes('status')) {
      if (fields.includes('position') || fields.includes('salary')) {
        defaults.status = 'WORKING';
      } else if (fields.includes('appointmentDate') || fields.includes('startTime')) {
        defaults.status = 'PENDING';
      } else if (fields.includes('roomName')) {
        defaults.status = 'AVAILABLE';
      } else if (fields.includes('paymentMethod')) {
        defaults.status = 'SUCCESS';
      } else {
        defaults.status = 'ACTIVE';
      }
    }
    return defaults;
  });

  function submit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  const getFieldInput = (f) => {
    console.log("getFieldInput field:", f, "is_image:", f === 'image', "typeof:", typeof f, "len:", f.length);
    const val = form[f] || '';
    const onChange = e => setForm({ ...form, [f]: e.target.value });

    if (f === 'gender') {
      return (
        <select value={val} onChange={onChange}>
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      );
    }
    if (f === 'customerType') {
      return (
        <select value={val} onChange={onChange}>
          <option value="THUONG">Thường (THUONG)</option>
          <option value="VIP">VIP</option>
          <option value="THAN_THIET">Thân thiết (THAN_THIET)</option>
        </select>
      );
    }
    if (f === 'position') {
      return (
        <select value={val} onChange={onChange}>
          <option value="KY_THUAT">Kỹ thuật viên (KY_THUAT)</option>
          <option value="LE_TAN">Lễ tân (LE_TAN)</option>
          <option value="QUAN_LY">Quản lý (QUAN_LY)</option>
        </select>
      );
    }
    if (f === 'roleName') {
      return (
        <select value={val} onChange={onChange}>
          <option value="ROLE_ADMIN">Quản trị viên (ROLE_ADMIN)</option>
          <option value="ROLE_NHAN_VIEN">Nhân viên (ROLE_NHAN_VIEN)</option>
          <option value="ROLE_KHACH_HANG">Khách hàng (ROLE_KHACH_HANG)</option>
        </select>
      );
    }
    if (f === 'discountType') {
      return (
        <select value={val} onChange={onChange}>
          <option value="PERCENT">Phần trăm (PERCENT)</option>
          <option value="AMOUNT">Số tiền (AMOUNT)</option>
        </select>
      );
    }
    if (f === 'status') {
      let opts = [
        { v: 'ACTIVE', t: 'Hoạt động (ACTIVE)' },
        { v: 'INACTIVE', t: 'Tạm tắt (INACTIVE)' }
      ];
      if (fields.includes('position') || fields.includes('salary')) {
        opts = [
          { v: 'WORKING', t: 'Đang làm (WORKING)' },
          { v: 'INACTIVE', t: 'Nghỉ việc (INACTIVE)' }
        ];
      } else if (fields.includes('appointmentDate') || fields.includes('startTime')) {
        opts = [
          { v: 'PENDING', t: 'Chờ xử lý (PENDING)' },
          { v: 'CONFIRMED', t: 'Đã xác nhận (CONFIRMED)' },
          { v: 'IN_PROGRESS', t: 'Đang thực hiện (IN_PROGRESS)' },
          { v: 'COMPLETED', t: 'Hoàn thành (COMPLETED)' },
          { v: 'CANCELLED', t: 'Đã hủy (CANCELLED)' }
        ];
      } else if (fields.includes('roomName')) {
        opts = [
          { v: 'AVAILABLE', t: 'Trống (AVAILABLE)' },
          { v: 'USING', t: 'Đang dùng (USING)' },
          { v: 'MAINTENANCE', t: 'Bảo trì (MAINTENANCE)' }
        ];
      } else if (fields.includes('paymentMethod')) {
        opts = [
          { v: 'SUCCESS', t: 'Thành công (SUCCESS)' },
          { v: 'CANCELLED', t: 'Thất bại (CANCELLED)' }
        ];
      }
      return (
        <select value={val} onChange={onChange}>
          {opts.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
        </select>
      );
    }
    if (f === 'paymentStatus') {
      return (
        <select value={val} onChange={onChange}>
          <option value="PENDING">Chờ thanh toán (PENDING)</option>
          <option value="PAID">Đã thanh toán (PAID)</option>
        </select>
      );
    }
    if (f === 'paymentMethod') {
      return (
        <select value={val} onChange={onChange}>
          <option value="TIEN_MAT">Tiền mặt (TIEN_MAT)</option>
          <option value="CHUYEN_KHOAN">Chuyển khoản (CHUYEN_KHOAN)</option>
          <option value="THE">Thẻ (THE)</option>
        </select>
      );
    }
    if (f === 'categoryName') {
      return (
        <select value={val} onChange={onChange}>
          <option value="">Chọn danh mục</option>
          {lookups.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      );
    }
    if (f === 'customerName') {
      return (
        <select value={val} onChange={onChange}>
          <option value="">Chọn khách hàng</option>
          {lookups.customers.map(c => <option key={c.id} value={c.fullName}>{c.fullName}</option>)}
        </select>
      );
    }
    if (f === 'employeeName') {
      return (
        <select value={val} onChange={onChange}>
          <option value="">Chọn nhân viên</option>
          {lookups.employees.map(e => <option key={e.id} value={e.fullName}>{e.fullName}</option>)}
        </select>
      );
    }
    if (f === 'roomName' && fields.includes('appointmentDate')) {
      return (
        <select value={val} onChange={onChange}>
          <option value="">Chọn phòng</option>
          {lookups.rooms.map(r => <option key={r.id} value={r.roomName || r.name}>{r.roomName || r.name}</option>)}
        </select>
      );
    }
    if (f === 'serviceName') {
      return (
        <select value={val} onChange={onChange}>
          <option value="">Chọn dịch vụ</option>
          {lookups.services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
      );
    }

    if (f === 'image' || f === 'imageUrl') {
      const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
          setForm({ ...form, [f]: 'Đang tải lên...' });
          const res = await axiosClient.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          const url = res.url || res;
          setForm({ ...form, [f]: url });
        } catch (err) {
          alert('Tải ảnh lên thất bại: ' + err.message);
          setForm({ ...form, [f]: '' });
        }
      };

      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      const host = apiBase.replace('/api', '');
      const fullImgUrl = val && !val.startsWith('http') && !val.startsWith('Đang') ? `${host}${val}` : val;

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleUpload}
              style={{ border: 'none', padding: 0 }}
            />
            {val && val.startsWith('Đang') && <span style={{ fontSize: '12px', color: '#ff6b6b' }}>{val}</span>}
          </div>
          {val && !val.startsWith('Đang') && (
            <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid var(--line)' }}>
              <img 
                src={fullImgUrl} 
                alt="Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <button 
                type="button" 
                onClick={() => setForm({ ...form, [f]: '' })}
                style={{
                  position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', color: '#fff', 
                  border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
      );
    }

    let type = 'text';
    if (f === 'password') type = 'password';
    else if (f.toLowerCase().includes('date')) type = 'date';
    if (f.toLowerCase().includes('time') || f === 'startTime') type = 'time';
    if (f === 'price' || f === 'salary' || f === 'duration' || f === 'capacity' || f === 'discountPercent' || f === 'amount' || f === 'totalAmount' || f === 'discountAmount' || f === 'finalAmount' || f === 'rating') {
      type = 'number';
    }

    return <input type={type} value={val} onChange={onChange} />;
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-box" onSubmit={submit}>
        <div className="modal-header">
          <h2>{initial ? 'Cập nhật' : 'Thêm mới'}</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>
        <div className="form-grid">
          {fields.map(f => (
            <label key={f}>
              <span>{fieldLabels[f] || f}</span>
              {getFieldInput(f)}
            </label>
          ))}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-light" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary">Lưu</button>
        </div>
      </form>
    </div>
  );
}
