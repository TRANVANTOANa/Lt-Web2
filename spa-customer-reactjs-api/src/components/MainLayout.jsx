import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, LogOut, Menu, Search, UserRound, X, Sparkles, Clock } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { categoryApi, serviceApi } from '../api/serviceApi';
import { mockCategories, mockServices } from '../data/mockData';
import { getServiceImage, money } from '../utils/format';

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Search Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [modalServices, setModalServices] = useState([]);
  const [modalCategories, setModalCategories] = useState([]);

  useEffect(() => {
    const fetchModalData = async () => {
      try {
        const [servicesData, categoriesData] = await Promise.all([
          serviceApi.getAll(),
          categoryApi.getAll()
        ]);
        setModalServices(servicesData?.length ? servicesData : mockServices);
        setModalCategories(categoriesData?.length ? categoriesData : mockCategories);
      } catch (err) {
        setModalServices(mockServices);
        setModalCategories(mockCategories);
      }
    };
    fetchModalData();
  }, []);

  // Close search modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    if (isSearchOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Synchronize category service counts
  const modalCategoryCounts = useMemo(() => {
    const counts = {};
    modalServices.forEach((s) => {
      if (s.category?.id) {
        counts[s.category.id] = (counts[s.category.id] || 0) + 1;
      }
    });
    return counts;
  }, [modalServices]);

  // Modal autocomplete suggestions
  const modalSuggestions = useMemo(() => {
    if (!searchKeyword.trim()) {
      return {
        isPopular: true,
        services: modalServices.slice(0, 3),
        categories: modalCategories.slice(0, 4)
      };
    }
    const term = searchKeyword.toLowerCase().trim();
    const matchedServices = modalServices
      .filter((s) => s.name?.toLowerCase().includes(term) || s.description?.toLowerCase().includes(term))
      .slice(0, 5);
    const matchedCategories = modalCategories
      .filter((c) => c.name?.toLowerCase().includes(term));
    
    return {
      isPopular: false,
      services: matchedServices,
      categories: matchedCategories
    };
  }, [modalServices, modalCategories, searchKeyword]);

  const handleModalCategoryClick = (catId) => {
    setIsSearchOpen(false);
    setSearchKeyword('');
    navigate(`/services?category=${catId}`);
  };

  const handleModalSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchKeyword.trim()) {
      setIsSearchOpen(false);
      const kw = searchKeyword.trim();
      setSearchKeyword('');
      navigate(`/services?keyword=${encodeURIComponent(kw)}`);
    }
  };

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
          <button 
            className="icon-btn search-trigger-btn" 
            onClick={() => setIsSearchOpen(true)} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '50%', transition: 'background-color 0.2s' }}
            title="Tìm kiếm dịch vụ..."
          >
            <Search size={22} />
          </button>
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

      {/* Global Search Modal Overlay */}
      {isSearchOpen && (
        <div className="search-modal-overlay" onClick={() => setIsSearchOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <div className="search-modal-input-wrapper">
                <Search size={22} />
                <input
                  className="search-modal-input"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={handleModalSearchSubmit}
                  placeholder="Tìm kiếm dịch vụ hoặc danh mục..."
                  autoFocus
                />
              </div>
              <button className="search-modal-close-btn" onClick={() => setIsSearchOpen(false)} title="Đóng tìm kiếm">
                <X size={20} />
              </button>
            </div>
            <div className="search-modal-body">
              {/* Category suggestions section */}
              {modalSuggestions.categories.length > 0 && (
                <div className="suggestion-section">
                  <div className="suggestion-section-title">
                    {modalSuggestions.isPopular ? 'Danh mục dịch vụ' : 'Danh mục tìm thấy'}
                  </div>
                  {modalSuggestions.categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="category-suggestion-item"
                      onClick={() => handleModalCategoryClick(cat.id)}
                    >
                      <span className="category-suggestion-name">{cat.name}</span>
                      <span className="category-suggestion-count">
                        {modalCategoryCounts[cat.id] || 0} dịch vụ
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Services suggestions section */}
              {modalSuggestions.services.length > 0 && (
                <div className="suggestion-section" style={{ marginTop: '16px' }}>
                  <div className="suggestion-section-title">
                    {modalSuggestions.isPopular ? 'Dịch vụ phổ biến' : 'Dịch vụ tìm thấy'}
                  </div>
                  {modalSuggestions.services.map((service) => {
                    const image = getServiceImage(service);
                    return (
                      <Link
                        key={service.id}
                        to={`/services/${service.id}`}
                        className="suggestion-item"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        {image ? (
                          <img src={image} className="suggestion-item-image" alt={service.name} />
                        ) : (
                          <div className="suggestion-item-image">
                            {service.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="suggestion-item-content">
                          <div className="suggestion-item-name">{service.name}</div>
                          <div className="suggestion-item-meta">
                            <span className="suggestion-item-price">{money(service.price)}</span>
                            <span>•</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Clock size={12} /> {service.duration || 60}m
                            </span>
                          </div>
                        </div>
                        <Sparkles size={14} style={{ color: 'var(--primary-2)', opacity: 0.8 }} />
                      </Link>
                    );
                  })}
                </div>
              )}

              {modalSuggestions.services.length === 0 && modalSuggestions.categories.length === 0 && (
                <div className="suggestion-empty">
                  Không tìm thấy kết quả nào phù hợp với "{searchKeyword}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
