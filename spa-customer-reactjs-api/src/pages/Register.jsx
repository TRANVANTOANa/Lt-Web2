import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorBox from '../components/ErrorBox';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.phone || !form.username || !form.password) return setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
    if (form.password !== form.confirm) return setError('Mật khẩu xác nhận không khớp.');
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        username: form.username,
        password: form.password,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card wide" onSubmit={submit}>
        <Link className="brand center-brand" to="/">Spa Beauty</Link>
        <h1>Đăng ký tài khoản</h1>
        <p>Thông tin này sẽ được dùng để đặt lịch và theo dõi dịch vụ.</p>
        <ErrorBox message={error} />
        <div className="form-grid">
          <label>Họ tên<input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} /></label>
          <label>Số điện thoại<input value={form.phone} onChange={(e) => update('phone', e.target.value)} /></label>
          <label>Email<input value={form.email} onChange={(e) => update('email', e.target.value)} /></label>
          <label>Tên đăng nhập<input value={form.username} onChange={(e) => update('username', e.target.value)} /></label>
          <label>Mật khẩu<input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} /></label>
          <label>Xác nhận mật khẩu<input type="password" value={form.confirm} onChange={(e) => update('confirm', e.target.value)} /></label>
        </div>
        <button className="btn solid big full" disabled={loading}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</button>
        <p className="auth-switch">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
      </form>
    </div>
  );
}
