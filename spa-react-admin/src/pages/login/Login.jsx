import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient.js';

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: 'admin', password: 'admin123' });
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await axiosClient.post('/auth/login', form);
      if (res?.token) {
        localStorage.setItem('spa_token', res.token);
        localStorage.setItem('spa_user', JSON.stringify({
          id: res?.id || 0,
          username: res?.username || form.username,
          fullName: res?.fullName || 'Admin Ly',
          role: res?.role || 'ROLE_ADMIN'
        }));
        nav('/');
      } else {
        setError('Đăng nhập thất bại: không nhận được token.');
      }
    } catch (err) {
      setError(err.message || 'Sai tài khoản hoặc mật khẩu');
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">✿</div>
        <h1>Spa Management</h1>
        <p>Đăng nhập trang quản trị</p>
        {error && <p style={{ color: '#d93025', fontSize: 14, margin: '0 0 8px' }}>{error}</p>}
        <label>
          Tài khoản
          <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        </label>
        <label>
          Mật khẩu
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </label>
        <button className="btn btn-primary">Đăng nhập</button>
      </form>
    </div>
  );
}
