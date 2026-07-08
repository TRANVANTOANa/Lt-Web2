import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';
import Dashboard from '../pages/dashboard/Dashboard.jsx';
import CustomerList from '../pages/customers/CustomerList.jsx';
import EmployeeList from '../pages/employees/EmployeeList.jsx';
import CategoryList from '../pages/categories/CategoryList.jsx';
import ServiceList from '../pages/services/ServiceList.jsx';
import AppointmentList from '../pages/appointments/AppointmentList.jsx';
import RoomList from '../pages/rooms/RoomList.jsx';
import InvoiceList from '../pages/invoices/InvoiceList.jsx';
import PromotionList from '../pages/promotions/PromotionList.jsx';
import ReviewList from '../pages/reviews/ReviewList.jsx';
import Reports from '../pages/reports/Reports.jsx';
import UserList from '../pages/users/UserList.jsx';
import { pageConfigs } from '../utils/constants.js';

export default function AdminLayout() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('spa_user') || '{}');

  function logout() {
    localStorage.removeItem('spa_user');
    localStorage.removeItem('spa_token');
    nav('/login');
  }

  return (
    <div className="admin-shell">
      <Sidebar onLogout={logout} />
      <main className="main-panel">
        <Header user={user} />
        <section className="content">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<CustomerList config={pageConfigs.customers} />} />
            <Route path="employees" element={<EmployeeList config={pageConfigs.employees} />} />
            <Route path="users" element={<UserList config={pageConfigs.users} />} />
            <Route path="service-categories" element={<CategoryList config={pageConfigs.categories} />} />
            <Route path="spa-services" element={<ServiceList config={pageConfigs.services} />} />
            <Route path="appointments" element={<AppointmentList config={pageConfigs.appointments} />} />
            <Route path="rooms" element={<RoomList config={pageConfigs.rooms} />} />
            <Route path="invoices" element={<InvoiceList config={pageConfigs.invoices} />} />
            <Route path="promotions" element={<PromotionList config={pageConfigs.promotions} />} />
            <Route path="reviews" element={<ReviewList config={pageConfigs.reviews} />} />
            <Route path="reports" element={<Reports />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}
