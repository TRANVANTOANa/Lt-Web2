export const money = (value) => {
  const number = Number(value || 0);
  return number.toLocaleString('vi-VN') + 'đ';
};

export const dateText = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
};

export const statusText = (status) => {
  const map = {
    DANG_CHO: 'Chờ xác nhận',
    DA_XAC_NHAN: 'Đã xác nhận',
    DANG_THUC_HIEN: 'Đang thực hiện',
    HOAN_THANH: 'Hoàn thành',
    DA_HUY: 'Đã hủy',
    KHACH_KHONG_DEN: 'Khách không đến',
    CHUA_THANH_TOAN: 'Chưa thanh toán',
    DA_THANH_TOAN: 'Đã thanh toán',
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Tạm ẩn',
  };
  return map[status] || status || 'Đang cập nhật';
};

export const statusClass = (status) => {
  if (['HOAN_THANH', 'DA_THANH_TOAN', 'ACTIVE', 'DA_XAC_NHAN'].includes(status)) return 'success';
  if (['DA_HUY', 'KHACH_KHONG_DEN', 'INACTIVE'].includes(status)) return 'danger';
  if (['DANG_THUC_HIEN'].includes(status)) return 'info';
  return 'warning';
};

export const getServiceImage = (service) => {
  const img = service?.image || service?.imageUrl || service?.thumbnail || '';
  if (img && !img.startsWith('http') && img.startsWith('/uploads')) {
    return 'http://localhost:8080' + img;
  }
  return img;
};

export const serviceOfAppointment = (appointment) => {
  const details = Array.isArray(appointment?.appointmentDetails)
    ? appointment.appointmentDetails
    : Array.from(appointment?.appointmentDetails || []);
  return details?.[0]?.service || appointment?.service || null;
};

export const getCustomerName = (obj) => obj?.customer?.fullName || obj?.fullName || 'Khách hàng';
