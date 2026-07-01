import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FiCalendar, FiDollarSign, FiStar, FiUser, FiUsers } from 'react-icons/fi';
import axiosClient from '../../api/axiosClient.js';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { money, revenueData, popularServices, mock } from '../../utils/constants.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosClient.get('/dashboard/stats')
      .then(res => setStats(res))
      .catch(() => setStats(null));
  }, []);

  const totalCustomers = stats?.totalCustomers ?? 1250;
  const totalEmployees = stats?.totalEmployees ?? 48;
  const totalServices = stats?.totalServices ?? 65;
  const appointmentsToday = stats?.appointmentsToday ?? 24;
  const revenueToday = stats?.revenueToday ?? 15500000;
  const revenueMonth = stats?.revenueMonth ?? 450000000;

  const chartData = stats?.monthlyRevenue 
    ? stats.monthlyRevenue.map((val, idx) => ({ month: `Th${idx + 1}`, revenue: Math.round(Number(val) / 1000000) }))
    : revenueData;

  const recentAppList = stats?.recentAppointments ?? mock.appointments;
  const popularSvcList = stats?.popularServices 
    ? stats.popularServices.map(s => ({ name: s.serviceName, count: s.bookings, percent: s.percentage }))
    : popularServices;

  return (
    <div>
      <div className="dashboard-title">
        <h1>Tổng quan</h1>
        <p>Chào mừng bạn quay lại hệ thống quản lý Spa.</p>
      </div>
      <div className="stats-grid">
        <StatCard icon={<FiUsers />} title="Tổng khách hàng" value={totalCustomers.toLocaleString()} sub="+15% tháng này" />
        <StatCard icon={<FiUser />} title="Tổng nhân viên" value={totalEmployees.toLocaleString()} />
        <StatCard icon={<FiStar />} title="Tổng dịch vụ" value={totalServices.toLocaleString()} />
        <StatCard icon={<FiCalendar />} title="Lịch hẹn hôm nay" value={appointmentsToday.toLocaleString()} sub="+5 lịch mới" />
        <StatCard icon={<FiDollarSign />} title="Doanh thu hôm nay" value={money(revenueToday)} />
        <StatCard icon={<FiDollarSign />} title="Doanh thu tháng" value={money(revenueMonth)} sub="+8% tháng trước" />
      </div>
      <div className="chart-card">
        <div className="section-heading">
          <h2>Doanh thu theo tháng</h2>
          <span>Doanh thu 2026</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f18aac" stopOpacity={.75} />
                <stop offset="95%" stopColor="#f18aac" stopOpacity={.08} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={v => `${v}M`} />
            <Tooltip formatter={v => [`${v} triệu`, 'Doanh thu']} />
            <Area type="monotone" dataKey="revenue" stroke="#e85d8c" fill="url(#g)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="dashboard-bottom">
        <div className="panel-card">
          <h2>Lịch hẹn gần nhất</h2>
          <table className="mini-table">
            <thead>
              <tr><th>Khách hàng</th><th>Dịch vụ</th><th>Thời gian</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {recentAppList.map((a, i) => (
                <tr key={i}>
                  <td>{a.customerName}</td>
                  <td>{a.serviceName}</td>
                  <td>{a.time || a.startTime}</td>
                  <td><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel-card">
          <h2>Dịch vụ phổ biến nhất</h2>
          <div className="popular-list">
            {popularSvcList.map((s, i) => (
              <div className="popular-row" key={i}>
                <div><b>{s.name}</b><span>{s.count} lượt</span></div>
                <div className="progress"><div style={{ width: `${s.percent}%` }} /></div>
                <em>{s.percent}%</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
