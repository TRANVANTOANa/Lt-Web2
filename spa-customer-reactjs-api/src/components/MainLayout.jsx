import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarDays, LogOut, Menu, Search, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="site-shell">
      <header className="header">
        <Link className="brand" to="/">Spa Beauty</Link>
        <button className="icon-btn mobile-only" onClick={() => setOpen(!open)}><Menu size={22} /></button>
        <nav className={open ? 'nav open' : 'nav'}>
          <NavLink to="/">Trang chủ</NavLink>
          <NavLink to="/services">Dịch vụ</NavLink>
          <NavLink to="/booking">Đặt lịch</NavLink>
          <NavLink to="/appointments">Lịch sử</NavLink>
          <NavLink to="/invoices">Hóa đơn</NavLink>
          <NavLink to="/contact">Liên hệ</NavLink>
        </nav>
        <div className="header-actions">
          <Search size={22} />
          {user ? (
            <>
              <Link className="profile-mini" to="/profile">
                {user.imageUrl ? (
                  <img src={user.imageUrl} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} alt="avatar" />
                ) : (
                  <UserRound size={18} />
                )}
                {user.fullName || user.username}
              </Link>
              <button className="btn ghost small" onClick={handleLogout}><LogOut size={16} /> Đăng xuất</button>
            </>
          ) : (
            <>
              <Link className="btn ghost" to="/login">Đăng nhập</Link>
              <Link className="btn solid" to="/register">Đăng ký</Link>
            </>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div>
          <h3>Spa Beauty</h3>
          <p>Không gian thư giãn, chăm sóc sắc đẹp và sức khỏe chuyên nghiệp.</p>
        </div>
        <div>
          <p><CalendarDays size={16} /> 08:00 - 21:00 mỗi ngày</p>
          <p>Hotline: 0909 000 999</p>
          <p>Email: spabeauty@example.com</p>
        </div>
      </footer>
    </div>
  );
}
