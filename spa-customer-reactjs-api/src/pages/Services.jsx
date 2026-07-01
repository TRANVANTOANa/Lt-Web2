import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { categoryApi, serviceApi } from '../api/serviceApi';
import ServiceCard from '../components/ServiceCard';
import ErrorBox from '../components/ErrorBox';
import Loading from '../components/Loading';
import { mockCategories, mockServices } from '../data/mockData';

export default function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [serviceData, categoryData] = await Promise.all([
        serviceApi.getAll(),
        categoryApi.getAll(),
      ]);
      setServices(serviceData?.length ? serviceData : mockServices);
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

  const filtered = useMemo(() => {
    return services.filter((item) => {
      const matchKeyword = !keyword || item.name?.toLowerCase().includes(keyword.toLowerCase());
      const matchCategory = categoryId === 'all' || String(item.category?.id) === String(categoryId);
      return matchKeyword && matchCategory;
    });
  }, [services, keyword, categoryId]);

  return (
    <div className="page">
      <section className="section-head center">
        <span className="eyebrow">Dịch vụ của chúng tôi</span>
        <h1>Khám phá các liệu trình chăm sóc sức khỏe và làm đẹp</h1>
        <p>React gọi API Spring Boot: <b>GET /api/spa-services</b> và <b>GET /api/service-categories</b>.</p>
      </section>

      <div className="filter-bar">
        <div className="search-box"><Search size={20} /><input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm kiếm dịch vụ..." /></div>
        <div className="chips">
          <button className={categoryId === 'all' ? 'active' : ''} onClick={() => setCategoryId('all')}>Tất cả</button>
          {categories.map((cat) => (
            <button key={cat.id} className={String(categoryId) === String(cat.id) ? 'active' : ''} onClick={() => setCategoryId(cat.id)}>{cat.name}</button>
          ))}
        </div>
      </div>

      <ErrorBox message={error} />
      {loading ? <Loading /> : <div className="service-grid">{filtered.map((service) => <ServiceCard key={service.id} service={service} />)}</div>}
    </div>
  );
}
