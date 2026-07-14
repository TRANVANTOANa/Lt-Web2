import React from 'react';
import { fieldLabels, money } from '../utils/constants.js';
import StatusBadge from './StatusBadge.jsx';

export default function ViewDetailModal({ title, row, onClose, columns = [] }) {
  if (!row) return null;

  // Build a map of columns to format items according to type (e.g. status badge, currency, or image)
  const formatTypeMap = {};
  columns.forEach(c => {
    if (c[2]) {
      formatTypeMap[c[0]] = c[2];
    }
  });

  // Fields to exclude from detail view
  const excludedFields = ['password', 'token', 'role'];

  const renderValue = (key, value) => {
    if (value === null || value === undefined || value === '') {
      return <span className="muted" style={{ fontStyle: 'italic', color: '#bbb' }}>Trống</span>;
    }

    const type = formatTypeMap[key];

    if (type === 'status') {
      return <StatusBadge status={value} />;
    }

    if (type === 'money' || key === 'salary' || key === 'price' || key === 'amount' || key === 'totalAmount' || key === 'discountAmount' || key === 'finalAmount') {
      return <strong style={{ color: 'var(--primary)' }}>{money(value)}</strong>;
    }

    if (type === 'image' || key === 'imageUrl' || key === 'image') {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          <img 
            src={value} 
            alt="Thumbnail" 
            style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', border: '1px solid var(--line)', marginTop: '4px', objectFit: 'cover' }} 
          />
        </a>
      );
    }

    if (typeof value === 'object') {
      return <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{JSON.stringify(value)}</span>;
    }

    return <span>{String(value)}</span>;
  };

  // Convert row object entries, filtering out relations and excluded fields
  const displayFields = Object.entries(row).filter(([key]) => {
    if (excludedFields.includes(key)) return false;
    return true;
  });

  return (
    <div className="modal-backdrop" style={{ zIndex: 1100 }}>
      <div className="modal-box" style={{ maxWidth: '580px', width: '90%' }}>
        <div className="modal-header">
          <h2>{title || 'Chi tiết thông tin'}</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>
        
        <div style={{ padding: '20px 0', maxHeight: '450px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px 24px' }}>
            {displayFields.map(([key, value]) => {
              const label = fieldLabels[key] || key;
              return (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid #f4eff2', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#88747a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {label}
                  </span>
                  <div style={{ fontSize: '15px', color: 'var(--text)', wordBreak: 'break-word' }}>
                    {renderValue(key, value)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-actions" style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', marginTop: '8px' }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
