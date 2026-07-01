import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

function RequireAuth({ children }) {
  return localStorage.getItem('spa_user') ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<RequireAuth><AdminLayout /></RequireAuth>} />
    </Routes>
  );
}
