import React from 'react';
export default function PaymentDelete({ item, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-box" style={{ maxWidth: 440, textAlign: 'center' }}>
        <div className="modal-header"><h2>Xác nhận xóa</h2><button type="button" onClick={onCancel}>×</button></div>
        <p style={{ margin: '18px 0', fontSize: 15, color: '#6b5c70' }}>Bạn có chắc chắn muốn xóa <b>{item.fullName || item.name || item.code || `#${item.id}`}</b>?</p>
        <div className="modal-actions" style={{ justifyContent: 'center' }}><button className="btn btn-light" onClick={onCancel}>Hủy</button><button className="btn btn-primary" style={{ background: '#d93025' }} onClick={() => onConfirm(item)}>Xóa</button></div>
      </div>
    </div>
  );
}
