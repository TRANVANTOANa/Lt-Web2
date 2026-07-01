import React, { useState } from 'react';
import axiosClient from '../api/axiosClient.js';

export default function ChangePasswordModal({ user, onClose }) {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    if (form.newPassword.length < 4) {
      setError('Mật khẩu mới phải từ 4 ký tự trở lên.');
      return;
    }

    try {
      await axiosClient.put(`/users/${user.id}/change-password`, {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      });
      setSuccess('Đổi mật khẩu thành công!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
    }
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 1000 }}>
      <form className="modal-box" onSubmit={submit} style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h2>Đổi mật khẩu</h2>
          <button type="button" onClick={onClose}>&times;</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {error && <p style={{ color: '#d93025', fontSize: '14px', margin: '0', fontWeight: 500 }}>{error}</p>}
          {success && <p style={{ color: '#148a55', fontSize: '14px', margin: '0', fontWeight: 500 }}>{success}</p>}
          
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: 'bold', fontSize: '14px', color: '#5d5064' }}>
            Mật khẩu hiện tại
            <input 
              type="password" 
              value={form.oldPassword} 
              onChange={e => setForm({ ...form, oldPassword: e.target.value })}
              style={{ border: '1px solid var(--line)', borderRadius: '14px', padding: '11px 12px', outline: 'none' }}
              required
            />
          </label>
          
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: 'bold', fontSize: '14px', color: '#5d5064' }}>
            Mật khẩu mới
            <input 
              type="password" 
              value={form.newPassword} 
              onChange={e => setForm({ ...form, newPassword: e.target.value })}
              style={{ border: '1px solid var(--line)', borderRadius: '14px', padding: '11px 12px', outline: 'none' }}
              required
            />
          </label>
          
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: 'bold', fontSize: '14px', color: '#5d5064' }}>
            Xác nhận mật khẩu mới
            <input 
              type="password" 
              value={form.confirmPassword} 
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              style={{ border: '1px solid var(--line)', borderRadius: '14px', padding: '11px 12px', outline: 'none' }}
              required
            />
          </label>
        </div>
        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <button type="button" className="btn btn-light" onClick={onClose}>Hủy</button>
          <button type="submit" className="btn btn-primary">Lưu</button>
        </div>
      </form>
    </div>
  );
}
