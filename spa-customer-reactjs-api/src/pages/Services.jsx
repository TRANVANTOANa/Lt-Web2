import { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Clock, Star, Search, SlidersHorizontal, X, RotateCcw, Sparkles, TrendingUp, Tag } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { categoryApi, serviceApi } from '../api/serviceApi';
import ServiceCard from '../components/ServiceCard';
import ErrorBox from '../components/ErrorBox';
import Loading from '../components/Loading';
import { mockCategories, mockServices } from '../data/mockData';
import { getServiceImage, money } from '../utils/format';

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [durationFilter, setDurationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapperRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const kw = searchParams.get('keyword') || '';
    const cat = searchParams.get('category') || 'all';
    setKeyword(kw);
    setCategoryId(cat);
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [serviceData, categoryData, promoData] = await Promise.all([
        serviceApi.getAll(),
        categoryApi.getAll(),
        axiosClient.get('/promotions/active').catch(() => []),
      ]);
      const svcs = serviceData?.length ? serviceData : mockServices;
      const promos = Array.isArray(promoData) ? promoData : [];
      // Gán promotions vào từng service
      const enriched = svcs.map(svc => ({
        ...svc,
        promotions: promos.filter(p =>
          (p.applicableServices || []).some(s => s.id === svc.id)
        )
      }));
      setServices(enriched);
      setCategories(categoryData?.length ? categoryData : mockCategories);
    } catch (err) {
      setError('Không kết nối được API, đang hiển thị dữ liệu mẫu.');
      setServices(mockServices);
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateUrlParams = (kw, catId) => {
    const params = {};
    if (kw) params.keyword = kw;
    if (catId && catId !== 'all') params.category = catId;
    setSearchParams(params);
  };

  const handleKeywordChange = (val) => {
    setKeyword(val);
    updateUrlParams(val, categoryId);
  };

  const handleCategorySelect = (id) => {
    setCategoryId(id);
    updateUrlParams(keyword, id);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setKeyword('');
    updateUrlParams('', categoryId);
  };

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setDurationFilter('all');
    setSortBy('default');
    setKeyword('');
    setCategoryId('all');
    setSearchParams({});
  };

  const categoryCounts = useMemo(() => {
    const counts = {};
    services.forEach((s) => {
      if (s.category?.id) {
        counts[s.category.id] = (counts[s.category.id] || 0) + 1;
      }
    });
    return counts;
  }, [services]);

  const suggestions = useMemo(() => {
    if (!showSuggestions) return { services: [], categories: [] };
    if (!keyword.trim()) {
      return {
        isPopular: true,
        services: services.slice(0, 4),
        categories: categories.slice(0, 4)
      };
    }
    const term = keyword.toLowerCase().trim();
    const matchedServices = services
      .filter((s) => s.name?.toLowerCase().includes(term) || s.description?.toLowerCase().includes(term))
      .slice(0, 5);
    const matchedCategories = categories
      .filter((c) => c.name?.toLowerCase().includes(term));
    return {
      isPopular: false,
      services: matchedServices,
      categories: matchedCategories
    };
  }, [services, categories, keyword, showSuggestions]);

  // Count active filters for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (minPrice) count++;
    if (maxPrice) count++;
    if (durationFilter !== 'all') count++;
    if (sortBy !== 'default') count++;
    return count;
  }, [minPrice, maxPrice, durationFilter, sortBy]);

  const filteredAndSorted = useMemo(() => {
    let result = [...services];
    if (keyword.trim()) {
      const term = keyword.toLowerCase().trim();
      result = result.filter(
        (s) => s.name?.toLowerCase().includes(term) || s.description?.toLowerCase().includes(term)
      );
    }
    if (categoryId !== 'all') {
      result = result.filter((s) => String(s.category?.id) === String(categoryId));
    }
    if (minPrice) {
      result = result.filter((s) => s.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((s) => s.price <= Number(maxPrice));
    }
    if (durationFilter !== 'all') {
      result = result.filter((s) => {
        const d = s.duration || 60;
        if (durationFilter === 'short') return d < 30;
        if (durationFilter === 'medium') return d >= 30 && d <= 60;
        if (durationFilter === 'long') return d > 60;
        return true;
      });
    }
    if (sortBy !== 'default') {
      result.sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'duration_asc') return (a.duration || 60) - (b.duration || 60);
        if (sortBy === 'duration_desc') return (b.duration || 60) - (a.duration || 60);
        if (sortBy === 'rating_desc') {
          return (parseFloat(b.rating) || 4.9) - (parseFloat(a.rating) || 4.9);
        }
        return 0;
      });
    }
    return result;
  }, [services, keyword, categoryId, minPrice, maxPrice, durationFilter, sortBy]);

  return (
    <div className="page">
      <section className="section-head center">
        <span className="eyebrow">Dịch vụ của chúng tôi</span>
        <h1>Khám phá các liệu trình chăm sóc<br />sức khỏe và làm đẹp</h1>
        <p>Tìm kiếm thông minh kết hợp các bộ lọc nâng cao để chọn liệu trình phù hợp nhất với bạn.</p>
      </section>

      {/* ===== SEARCH AREA ===== */}
      <div className="search-area">
        {/* Search Bar */}
        <div ref={searchWrapperRef} className="search-wrapper-relative">
          <div className="search-bar-premium">
            <div className="search-bar-icon">
              <Search size={22} />
            </div>
            <input
              className="search-bar-input"
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Tìm kiếm dịch vụ, liệu trình..."
            />
            {keyword && (
              <button className="clear-search-btn" onClick={handleClearSearch} title="Xóa">
                <X size={18} />
              </button>
            )}
            <button
              className={`adv-toggle-btn ${showAdvanced ? 'active' : ''}`}
              onClick={() => setShowAdvanced(!showAdvanced)}
              title="Bộ lọc nâng cao"
            >
              <SlidersHorizontal size={18} />
              <span className="adv-toggle-text">Bộ lọc</span>
              {activeFilterCount > 0 && (
                <span className="filter-badge">{activeFilterCount}</span>
              )}
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="suggestions-dropdown">
              {suggestions.categories.length > 0 && (
                <div className="suggestion-section">
                  <div className="suggestion-section-title">
                    <Tag size={12} />
                    {suggestions.isPopular ? 'Danh mục' : 'Danh mục tìm thấy'}
                  </div>
                  {suggestions.categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="category-suggestion-item"
                      onClick={() => handleCategorySelect(cat.id)}
                    >
                      <span className="category-suggestion-name">{cat.name}</span>
                      <span className="category-suggestion-count">
                        {categoryCounts[cat.id] || 0} dịch vụ
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {suggestions.services.length > 0 && (
                <div className="suggestion-section">
                  <div className="suggestion-section-title">
                    <Sparkles size={12} />
                    {suggestions.isPopular ? 'Dịch vụ nổi bật' : 'Dịch vụ gợi ý'}
                  </div>
                  {suggestions.services.map((service) => {
                    const image = getServiceImage(service);
                    return (
                      <Link
                        key={service.id}
                        to={`/services/${service.id}`}
                        className="suggestion-item"
                        onClick={() => setShowSuggestions(false)}
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
                            <span className="suggestion-meta-dot">•</span>
                            <Clock size={12} />
                            <span>{service.duration || 60} phút</span>
                          </div>
                        </div>
                        <Star size={14} style={{ color: '#e4b63e' }} />
                      </Link>
                    );
                  })}
                </div>
              )}
              {suggestions.services.length === 0 && suggestions.categories.length === 0 && (
                <div className="suggestion-empty">
                  <Search size={24} style={{ marginBottom: '8px', opacity: 0.4 }} />
                  <div>Không tìm thấy kết quả nào cho "<strong>{keyword}</strong>"</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category Chips Row */}
        <div className="category-chips-row">
          <button
            className={`category-chip ${categoryId === 'all' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('all')}
          >
            <Sparkles size={14} />
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-chip ${String(categoryId) === String(cat.id) ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ===== ADVANCED FILTERS PANEL ===== */}
      {showAdvanced && (
        <div className="advanced-filters-panel">
          <div className="adv-panel-header">
            <h3 className="advanced-filters-title">
              <SlidersHorizontal size={20} />
              Bộ lọc & Sắp xếp nâng cao
            </h3>
            {activeFilterCount > 0 && (
              <button className="btn ghost small" onClick={handleResetFilters} style={{ margin: 0 }}>
                <RotateCcw size={14} /> Xóa bộ lọc ({activeFilterCount})
              </button>
            )}
          </div>
          
          <div className="filters-grid">
            <div className="filter-group">
              <label><Tag size={14} /> Khoảng giá (VNĐ)</label>
              <div className="price-inputs-row">
                <input
                  type="number"
                  placeholder="Từ"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="price-connector">—</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label><Clock size={14} /> Thời gian thực hiện</label>
              <div className="duration-chip-group">
                {[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'short', label: '< 30 phút' },
                  { value: 'medium', label: '30–60 phút' },
                  { value: 'long', label: '> 60 phút' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`filter-chip ${durationFilter === item.value ? 'active' : ''}`}
                    onClick={() => setDurationFilter(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label><TrendingUp size={14} /> Sắp xếp theo</label>
              <div className="sort-chip-group">
                {[
                  { value: 'default', label: 'Mặc định' },
                  { value: 'price_asc', label: 'Giá ↑' },
                  { value: 'price_desc', label: 'Giá ↓' },
                  { value: 'duration_asc', label: 'Nhanh nhất' },
                  { value: 'duration_desc', label: 'Lâu nhất' },
                  { value: 'rating_desc', label: '⭐ Đánh giá' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`filter-chip ${sortBy === item.value ? 'active' : ''}`}
                    onClick={() => setSortBy(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <ErrorBox message={error} />

      {/* Results count */}
      {!loading && (
        <div className="results-info-row">
          <span className="results-count">
            Hiển thị <strong>{filteredAndSorted.length}</strong> trên {services.length} dịch vụ
          </span>
          {(keyword || categoryId !== 'all' || activeFilterCount > 0) && (
            <button className="reset-link" onClick={handleResetFilters}>
              <RotateCcw size={14} /> Xóa tất cả bộ lọc
            </button>
          )}
        </div>
      )}
      
      {loading ? (
        <Loading />
      ) : (
        <>
          {filteredAndSorted.length > 0 ? (
            <div className="service-grid">
              {filteredAndSorted.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="empty-state-card">
              <Search size={40} className="empty-state-icon" />
              <h3>Không tìm thấy dịch vụ nào</h3>
              <p>Thử thay đổi từ khóa hoặc bộ lọc của bạn</p>
              <button className="btn solid" onClick={handleResetFilters}>
                <RotateCcw size={16} /> Đặt lại tất cả
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
