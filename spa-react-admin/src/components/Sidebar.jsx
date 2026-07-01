import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { menus } from '../utils/constants.js';

export default function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">✿</div>
        <div>
          <h2>Spa</h2>
          <span>Management</span>
        </div>
      </div>
      <nav>
        {menus.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => 'menu-item ' + (isActive ? 'active' : '')}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="logout-btn" onClick={onLogout}>
        <FiLogOut /> Đăng xuất
      </button>
    </aside>
  );
}
