import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorBox from '../components/ErrorBox';
import { authApi } from '../api/authApi';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [email, setEmail] = useState('');
  const [view, setView] = useState('login'); // 'login' | 'forgot'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const submitLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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

  const submitForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.forgotPassword(email);
      setSuccess(response.message || 'Mật khẩu mới đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư.');
      setEmail('');
      // Optionally switch back to login mode after 5 seconds
      setTimeout(() => {
        setView('login');
      }, 5000);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {view === 'login' ? (
        <form className="auth-card" onSubmit={submitLogin}>
          <Link className="brand center-brand" to="/">Spa Beauty</Link>
          <h1>Đăng nhập</h1>
          <p>Đăng nhập để đặt lịch, xem lịch sử và hóa đơn.</p>
          <ErrorBox message={error} />
          {success && <div className="success-box" style={{ width: '100%', margin: '10px 0' }}>{success}</div>}
          
          <label>Tên đăng nhập
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="username" required />
          </label>
          <label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Mật khẩu</span>
              <button 
                type="button" 
                onClick={() => { setView('forgot'); setError(''); setSuccess(''); }} 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', padding: 0 }}
              >
                Quên mật khẩu?
              </button>
            </div>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••" required />
          </label>
          <button className="btn solid big full" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
          <p className="auth-switch">Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
        </form>
      ) : (
        <form className="auth-card" onSubmit={submitForgotPassword}>
          <Link className="brand center-brand" to="/">Spa Beauty</Link>
          <h1>Quên mật khẩu</h1>
          <p>Nhập email tài khoản của bạn để nhận mật khẩu tạm thời.</p>
          <ErrorBox message={error} />
          {success && <div className="success-box" style={{ width: '100%', margin: '10px 0' }}>{success}</div>}

          <label>Địa chỉ Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" required />
          </label>
          <button className="btn solid big full" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi mật khẩu tạm thời'}</button>
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button 
              type="button" 
              onClick={() => { setView('login'); setError(''); setSuccess(''); }} 
              style={{ background: 'none', border: 'none', color: 'var(--muted)', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              Quay lại đăng nhập
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
