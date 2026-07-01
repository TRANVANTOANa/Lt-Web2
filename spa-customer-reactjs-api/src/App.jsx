import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import Booking from './pages/Booking.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import AppointmentHistory from './pages/AppointmentHistory.jsx';
import AppointmentDetail from './pages/AppointmentDetail.jsx';
import MyInvoices from './pages/MyInvoices.jsx';
import Contact from './pages/Contact.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/:serviceId" element={<Booking />} />
        <Route path="/appointments" element={<AppointmentHistory />} />
        <Route path="/appointments/:id" element={<AppointmentDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/invoices" element={<MyInvoices />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
