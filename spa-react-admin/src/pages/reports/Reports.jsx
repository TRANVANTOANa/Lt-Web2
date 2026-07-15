import React, { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FiCalendar, FiDollarSign, FiStar, FiUsers } from 'react-icons/fi';
import axiosClient from '../../api/axiosClient.js';
import StatCard from '../../components/StatCard.jsx';
import { money, revenueData, popularServices } from '../../utils/constants.js';

export default function Reports() {
  const [stats, setStats] = useState(null);

  // Filter States
  const [filterType, setFilterType] = useState('month'); // 'month' or 'range'
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(null); // null means All months
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchStats = (params = {}) => {
    axiosClient.get('/dashboard/stats', { params })
      .then(res => setStats(res))
      .catch(() => setStats(null));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilter = () => {
    const params = {};
    if (filterType === 'month') {
      params.year = year;
      if (month !== null) {
        params.month = month;
      }
    } else {
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
    }
    fetchStats(params);
  };

  const handleReset = () => {
    setFilterType('month');
    const curYear = new Date().getFullYear();
    setYear(curYear);
    setMonth(null);
    setStartDate('');
    setEndDate('');
    fetchStats();
  };

  const totalCustomers = stats?.totalCustomers ?? 1250;
  const appointmentsToday = stats?.appointmentsToday ?? 24;
  const revenueToday = stats?.revenueToday ?? 15500000;
  const revenueMonth = stats?.revenueMonth ?? 450000000;

  // Filter labels
  const isFiltered = filterType === 'range' ? (startDate || endDate) : (month !== null);
  const periodLabel = isFiltered ? "trong kỳ" : "tháng này";

  const chartData = stats?.chartData 
    ? stats.chartData.map(item => ({ month: item.label, revenue: Math.round(Number(item.revenue) / 1000000) }))
    : revenueData;

  const popularSvcList = stats?.popularServices 
    ? stats.popularServices.map(s => ({ name: s.serviceName, count: s.bookings, percent: s.percentage }))
    : popularServices;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Thống kê báo cáo</h1>
          <p>Theo dõi doanh thu, lịch hẹn và dịch vụ nổi bật.</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '16px',
        background: '#fff',
        padding: '16px 24px',
        borderRadius: '16px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(119, 87, 99, 0.05)',
        border: '1px solid #f0e5e9'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#8a7580' }}>Loại bộ lọc</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #eadce2', outline: 'none', background: '#fff' }}
          >
            <option value="month">Theo tháng & năm</option>
            <option value="range">Theo khoảng ngày</option>
          </select>
        </div>

        {filterType === 'month' ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#8a7580' }}>Năm</label>
              <select 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #eadce2', outline: 'none', minWidth: '100px', background: '#fff' }}
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#8a7580' }}>Tháng</label>
              <select 
                value={month === null ? '' : month} 
                onChange={(e) => setMonth(e.target.value === '' ? null : Number(e.target.value))}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #eadce2', outline: 'none', minWidth: '120px', background: '#fff' }}
              >
                <option value="">Tất cả các tháng</option>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#8a7580' }}>Từ ngày</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #eadce2', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#8a7580' }}>Đến ngày</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #eadce2', outline: 'none' }}
              />
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', alignSelf: 'flex-end' }}>
          <button 
            onClick={handleFilter} 
            className="btn solid"
            style={{ padding: '9px 20px', fontSize: '14px' }}
          >
            Lọc kết quả
          </button>
          <button 
            onClick={handleReset} 
            className="btn ghost"
            style={{ padding: '9px 20px', fontSize: '14px', border: '1px solid #eadce2' }}
          >
            Mặc định
          </button>
        </div>
      </div>

      <div className="stats-grid report-stats">
        <StatCard icon={<FiDollarSign />} title="Doanh thu hôm nay" value={money(revenueToday)} />
        <StatCard icon={<FiDollarSign />} title={`Doanh thu ${periodLabel}`} value={money(stats?.revenuePeriod ?? revenueMonth)} />
        <StatCard icon={<FiCalendar />} title={`Lịch hẹn ${periodLabel}`} value={(stats?.appointmentsPeriod ?? (appointmentsToday * 30)).toLocaleString()} />
        <StatCard icon={<FiUsers />} title={`Khách hàng mới ${periodLabel}`} value={(stats?.customersPeriod ?? Math.round(totalCustomers * 0.07)).toLocaleString()} />
        <StatCard icon={<FiStar />} title={`Dịch vụ bán chạy ${periodLabel}`} value={stats?.bestServicePeriod ?? "Massage body"} />
      </div>

      <div className="report-grid">
        <div className="chart-card">
          <h2>Doanh thu theo tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#e85d8c" fill="#f8bdd1" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h2>Dịch vụ được dùng nhiều nhất</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={popularSvcList}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#e85d8c" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
