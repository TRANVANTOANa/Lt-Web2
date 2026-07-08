import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, LogOut, Menu, Search, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
          <NavLink 
            to="/appointments" 
            className={location.pathname.startsWith('/appointments') ? 'active' : ''}
          >
            Lịch sử
          </NavLink>
          <NavLink 
            to="/invoices" 
            className={location.pathname.startsWith('/invoices') ? 'active' : ''}
          >
            Hóa đơn
          </NavLink>
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
      <footer className="footer-redesign">
        <div className="footer-content-row">
          <h3 className="footer-brand">Spa Beauty</h3>
          <ul className="footer-info-list">
            <li className="footer-info-item">Địa chỉ: 123 Wellness Way</li>
            <li className="footer-info-item">SĐT: 0123-456-789</li>
            <li className="footer-info-item">Email: info@spabeauty.com</li>
            <li className="footer-info-item">Giờ làm việc: 08:00 - 20:00</li>
          </ul>
        </div>
        <hr className="footer-divider" />
        <p className="footer-copyright">© 2024 Spa Beauty. All rights reserved.</p>
      </footer>
    </div>
  );
}
