import React from 'react';
import { FiSearch } from 'react-icons/fi';

export default function Header({ user }) {
  return (
    <header className="topbar">
      <div className="search-box">
        <FiSearch />
        <input placeholder="Tìm kiếm..." />
      </div>
      <div className="topbar-user">
        <div className="avatar">A</div>
        <div>
          <b>{user?.fullName || 'Admin Ly'}</b>
          <span>Quản trị viên</span>
        </div>
      </div>
    </header>
  );
}
