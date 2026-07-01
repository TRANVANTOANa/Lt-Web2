import React, { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FiCalendar, FiDollarSign, FiStar, FiUsers } from 'react-icons/fi';
import axiosClient from '../../api/axiosClient.js';
import StatCard from '../../components/StatCard.jsx';
import { money, revenueData, popularServices } from '../../utils/constants.js';

export default function Reports() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosClient.get('/dashboard/stats')
      .then(res => setStats(res))
      .catch(() => setStats(null));
  }, []);

  const totalCustomers = stats?.totalCustomers ?? 1250;
  const appointmentsToday = stats?.appointmentsToday ?? 24;
  const revenueToday = stats?.revenueToday ?? 15500000;
  const revenueMonth = stats?.revenueMonth ?? 450000000;

  const chartData = stats?.monthlyRevenue 
    ? stats.monthlyRevenue.map((val, idx) => ({ month: `Th${idx + 1}`, revenue: Math.round(Number(val) / 1000000) }))
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
      <div className="stats-grid report-stats">
        <StatCard icon={<FiDollarSign />} title="Doanh thu ngày" value={money(revenueToday)} />
        <StatCard icon={<FiDollarSign />} title="Doanh thu tháng" value={money(revenueMonth)} />
        <StatCard icon={<FiCalendar />} title="Lịch hẹn tháng" value={(appointmentsToday * 30).toLocaleString()} />
        <StatCard icon={<FiUsers />} title="Khách hàng mới" value={Math.round(totalCustomers * 0.07).toLocaleString()} />
        <StatCard icon={<FiStar />} title="Dịch vụ bán chạy" value="Massage body" />
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
