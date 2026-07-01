import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorBox from '../components/ErrorBox';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link className="brand center-brand" to="/">Spa Beauty</Link>
        <h1>Đăng nhập</h1>
        <p>Đăng nhập để đặt lịch, xem lịch sử và hóa đơn.</p>
        <ErrorBox message={error} />
        <label>Tên đăng nhập
          <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="username" />
        </label>
        <label>Mật khẩu
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••" />
        </label>
        <button className="btn solid big full" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
        <p className="auth-switch">Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
      </form>
    </div>
  );
}
