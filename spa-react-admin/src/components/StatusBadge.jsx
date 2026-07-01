import React from 'react';

export function statusText(s) {
  return ({
    ACTIVE: 'Hoạt động', INACTIVE: 'Tạm tắt', WORKING: 'Đang làm',
    AVAILABLE: 'Trống', USING: 'Đang dùng', MAINTENANCE: 'Bảo trì',
    PENDING: 'Chờ xử lý', CONFIRMED: 'Đã xác nhận', IN_PROGRESS: 'Đang thực hiện',
    COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy', PAID: 'Đã thanh toán',
    SUCCESS: 'Thành công', SHOW: 'Hiển thị', HIDE: 'Đã ẩn'
  }[s] || s);
}

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${String(status || '').toLowerCase().replaceAll('_', '-')}`}>
      {statusText(status)}
    </span>
  );
}
