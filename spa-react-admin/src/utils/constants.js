import { FiCalendar, FiCreditCard, FiDollarSign, FiGift, FiGrid, FiHome, FiMessageCircle, FiPieChart, FiSearch, FiSettings, FiShoppingBag, FiStar, FiUser, FiUsers, FiShield } from 'react-icons/fi';

export const money = (n) => Number(n || 0).toLocaleString('vi-VN') + ' VNĐ';

export const revenueData = [
  { month: 'Th1', revenue: 350 }, { month: 'Th2', revenue: 380 }, { month: 'Th3', revenue: 410 },
  { month: 'Th4', revenue: 390 }, { month: 'Th5', revenue: 420 }, { month: 'Th6', revenue: 450 },
  { month: 'Th7', revenue: 480 }, { month: 'Th8', revenue: 510 }, { month: 'Th9', revenue: 540 },
  { month: 'Th10', revenue: 560 }, { month: 'Th11', revenue: 590 }, { month: 'Th12', revenue: 620 },
];

export const popularServices = [
  { name: 'Massage thư giãn', count: 150, percent: 95 },
  { name: 'Chăm sóc da mặt', count: 120, percent: 80 },
  { name: 'Gội đầu thảo dược', count: 100, percent: 70 },
  { name: 'Tẩy tế bào chết', count: 90, percent: 65 },
  { name: 'Xông hơi đá muối', count: 80, percent: 60 },
];

export const mock = {
  customers: [
    { id: 1, fullName: 'Nguyễn Thị Lan', phone: '0901234567', email: 'lan@gmail.com', gender: 'Nữ', customerType: 'VIP' },
    { id: 2, fullName: 'Trần Văn Hùng', phone: '0912345678', email: 'hung@gmail.com', gender: 'Nam', customerType: 'THUONG' },
    { id: 3, fullName: 'Lê Thị Mai', phone: '0923456789', email: 'mai@gmail.com', gender: 'Nữ', customerType: 'THAN_THIET' },
  ],
  employees: [
    { id: 1, fullName: 'Phạm Hoàng Oanh', phone: '0934567890', email: 'oanh@spa.com', position: 'KY_THUAT', salary: 9000000, status: 'DANG_LAM' },
    { id: 2, fullName: 'Ngô Minh Anh', phone: '0945678901', email: 'anh@spa.com', position: 'LE_TAN', salary: 7500000, status: 'DANG_LAM' },
    { id: 3, fullName: 'Đặng Gia Hân', phone: '0956789012', email: 'han@spa.com', position: 'QUAN_LY', salary: 15000000, status: 'DANG_LAM' },
  ],
  categories: [
    { id: 1, name: 'Massage', description: 'Dịch vụ massage thư giãn', status: 'ACTIVE' },
    { id: 2, name: 'Chăm sóc da', description: 'Dịch vụ chăm sóc da mặt', status: 'ACTIVE' },
    { id: 3, name: 'Gội đầu dưỡng sinh', description: 'Gội đầu kết hợp massage', status: 'ACTIVE' },
  ],
  services: [
    { id: 1, name: 'Massage thư giãn', categoryName: 'Massage', price: 350000, duration: 60, status: 'ACTIVE' },
    { id: 2, name: 'Chăm sóc da mặt', categoryName: 'Chăm sóc da', price: 450000, duration: 75, status: 'ACTIVE' },
    { id: 3, name: 'Gội đầu thảo dược', categoryName: 'Gội đầu dưỡng sinh', price: 180000, duration: 45, status: 'ACTIVE' },
  ],
  appointments: [
    { id: 1, customerName: 'Nguyễn Thị Lan', serviceName: 'Massage thư giãn', employeeName: 'Phạm Hoàng Oanh', roomName: 'Phòng 01', appointmentDate: '2026-06-23', startTime: '10:00', status: 'DANG_CHO' },
    { id: 2, customerName: 'Trần Văn Hùng', serviceName: 'Chăm sóc da mặt', employeeName: 'Ngô Minh Anh', roomName: 'Phòng 02', appointmentDate: '2026-06-23', startTime: '11:30', status: 'DANG_THUC_HIEN' },
    { id: 3, customerName: 'Lê Thị Mai', serviceName: 'Gội đầu thảo dược', employeeName: 'Phạm Hoàng Oanh', roomName: 'Phòng 03', appointmentDate: '2026-06-23', startTime: '13:00', status: 'HOAN_THANH' },
  ],
  rooms: [
    { id: 1, roomName: 'Phòng VIP 1', description: 'Phòng trị liệu cao cấp', status: 'TRONG' },
    { id: 2, roomName: 'Phòng VIP 2', description: 'Phòng trị liệu cao cấp 2', status: 'DANG_SU_DUNG' },
    { id: 3, roomName: 'Phòng Thường 1', description: 'Phòng trị liệu tiêu chuẩn', status: 'BAO_TRI' },
  ],
  invoices: [
    { id: 1, customerName: 'Nguyễn Thị Lan', createdAt: '2026-06-23', totalAmount: 350000, discountAmount: 35000, finalAmount: 315000, paymentStatus: 'DA_THANH_TOAN' },
    { id: 2, customerName: 'Trần Văn Hùng', createdAt: '2026-06-23', totalAmount: 450000, discountAmount: 0, finalAmount: 450000, paymentStatus: 'CHUA_THANH_TOAN' },
  ],
  payments: [
    { id: 1, invoiceId: 1, amount: 315000, paymentMethod: 'TIEN_MAT', paymentDate: '2026-06-23', status: 'THANH_CONG' },
    { id: 2, invoiceId: 2, amount: 450000, paymentMethod: 'CHUYEN_KHOAN', paymentDate: '2026-06-23', status: 'THANH_CONG' },
  ],
  promotions: [
    { id: 1, code: 'SPA10', name: 'Giảm 10% khách mới', discountType: 'PERCENT', discountValue: 10, startDate: '2026-06-01', endDate: '2026-06-30', status: 'ACTIVE' },
    { id: 2, code: 'VIP15', name: 'Ưu đãi khách VIP', discountType: 'PERCENT', discountValue: 15, startDate: '2026-06-01', endDate: '2026-12-31', status: 'ACTIVE' },
  ],
  reviews: [
    { id: 1, customerName: 'Nguyễn Thị Lan', serviceName: 'Massage thư giãn', rating: 5, comment: 'Dịch vụ tốt, nhân viên nhiệt tình', createdAt: '2026-06-23' },
    { id: 2, customerName: 'Lê Thị Mai', serviceName: 'Gội đầu thảo dược', rating: 4, comment: 'Không gian sạch đẹp', createdAt: '2026-06-22' },
  ],
  users: [
    { id: 1, username: 'admin', fullName: 'Admin Ly', email: 'admin@spamanagement.com', phone: '0987654321', roleName: 'ROLE_ADMIN', status: 'ACTIVE' },
    { id: 2, username: 'staff', fullName: 'Nhân Viên Spa', email: 'staff@spamanagement.com', phone: '0912345678', roleName: 'ROLE_NHAN_VIEN', status: 'ACTIVE' },
  ]
};

export const pageConfigs = {
  customers: {
    title: 'Quản lý khách hàng', desc: 'Quản lý thông tin khách hàng sử dụng dịch vụ Spa.', endpoint: '/customers', mock: mock.customers,
    columns: [['id','Mã'], ['fullName','Họ tên'], ['phone','Số điện thoại'], ['email','Email'], ['gender','Giới tính'], ['customerType','Loại khách']],
    fields: ['fullName','phone','email','gender','customerType']
  },
  employees: {
    title: 'Quản lý nhân viên', desc: 'Quản lý hồ sơ nhân viên, chức vụ và trạng thái làm việc.', endpoint: '/employees', mock: mock.employees,
    columns: [['id','Mã'], ['fullName','Họ tên'], ['phone','Số điện thoại'], ['email','Email'], ['position','Chức vụ'], ['salary','Lương','money'], ['status','Trạng thái','status']],
    fields: ['fullName','phone','email','position','salary','status']
  },
  users: {
    title: 'Quản lý tài khoản', desc: 'Quản lý tài khoản người dùng hệ thống, phân quyền và mật khẩu.', endpoint: '/users', mock: mock.users,
    columns: [['id','Mã'], ['username','Tên tài khoản'], ['fullName','Họ tên'], ['email','Email'], ['phone','Số điện thoại'], ['roleName','Vai trò'], ['status','Trạng thái','status']],
    fields: ['username', 'password', 'fullName', 'email', 'phone', 'roleName', 'status']
  },
  categories: {
    title: 'Quản lý danh mục dịch vụ', desc: 'Phân loại các dịch vụ Spa.', endpoint: '/service-categories', mock: mock.categories,
    columns: [['id','Mã'], ['name','Tên danh mục'], ['description','Mô tả'], ['status','Trạng thái','status']],
    fields: ['name','description','status']
  },
  services: {
    title: 'Quản lý dịch vụ Spa', desc: 'Thêm, sửa, xóa, tìm kiếm dịch vụ Spa.', endpoint: '/spa-services', mock: mock.services,
    columns: [['id','Mã'], ['name','Tên dịch vụ'], ['categoryName','Danh mục'], ['price','Giá','money'], ['duration','Thời gian (phút)'], ['status','Trạng thái','status']],
    fields: ['name','categoryName','price','duration','description','status']
  },
  appointments: {
    title: 'Quản lý lịch hẹn', desc: 'Xác nhận, hủy và cập nhật trạng thái lịch hẹn.', endpoint: '/appointments', mock: mock.appointments,
    columns: [['id','Mã'], ['customerName','Khách hàng'], ['serviceName','Dịch vụ'], ['employeeName','Nhân viên'], ['roomName','Phòng'], ['appointmentDate','Ngày'], ['startTime','Giờ'], ['status','Trạng thái','status']],
    fields: ['customerName','serviceName','employeeName','roomName','appointmentDate','startTime','status']
  },
  rooms: {
    title: 'Quản lý phòng Spa', desc: 'Quản lý phòng dịch vụ và trạng thái sử dụng.', endpoint: '/rooms', mock: mock.rooms,
    columns: [['id','Mã'], ['roomName','Tên phòng'], ['description','Mô tả'], ['status','Trạng thái','status']],
    fields: ['roomName','description','status']
  },
  invoices: {
    title: 'Quản lý hóa đơn', desc: 'Tạo hóa đơn, xem chi tiết và cập nhật thanh toán.', endpoint: '/invoices', mock: mock.invoices,
    columns: [['id','Mã'], ['customerName','Khách hàng'], ['createdAt','Ngày tạo'], ['totalAmount','Tổng tiền','money'], ['discountAmount','Giảm giá','money'], ['finalAmount','Thành tiền','money'], ['paymentStatus','Trạng thái','status']],
    fields: ['customerName','totalAmount','discountAmount','finalAmount','paymentStatus']
  },
  payments: {
    title: 'Quản lý thanh toán', desc: 'Theo dõi lịch sử thanh toán hóa đơn.', endpoint: '/payments', mock: mock.payments,
    columns: [['id','Mã'], ['amount','Số tiền','money'], ['paymentMethod','Phương thức'], ['paymentDate','Ngày thanh toán'], ['status','Trạng thái','status']],
    fields: ['amount','paymentMethod','status']
  },
  promotions: {
    title: 'Quản lý khuyến mãi', desc: 'Quản lý mã giảm giá và thời gian áp dụng.', endpoint: '/promotions', mock: mock.promotions,
    columns: [['id','Mã'], ['code','Mã KM'], ['name','Tên chương trình'], ['discountType','Loại giảm'], ['discountValue','Giá trị giảm'], ['startDate','Bắt đầu'], ['endDate','Kết thúc'], ['status','Trạng thái','status']],
    fields: ['code','name','discountType','discountValue','startDate','endDate','status']
  },
  reviews: {
    title: 'Quản lý đánh giá', desc: 'Quản lý đánh giá của khách hàng sau khi sử dụng dịch vụ.', endpoint: '/reviews', mock: mock.reviews,
    columns: [['id','Mã'], ['customerName','Khách hàng'], ['serviceName','Dịch vụ'], ['rating','Sao'], ['comment','Nhận xét'], ['createdAt','Ngày']],
    fields: ['customerName','serviceName','rating','comment']
  }
};

export const menus = [
  ['/', 'Tổng quan', FiHome], ['/customers', 'Khách hàng', FiUsers], ['/employees', 'Nhân viên', FiUser],
  ['/users', 'Tài khoản', FiShield],
  ['/service-categories', 'Danh mục', FiGrid], ['/spa-services', 'Dịch vụ', FiStar], ['/appointments', 'Lịch hẹn', FiCalendar],
  ['/rooms', 'Phòng', FiShoppingBag], ['/invoices', 'Hóa đơn', FiCreditCard], ['/payments', 'Thanh toán', FiSettings],
  ['/promotions', 'Khuyến mãi', FiGift], ['/reviews', 'Đánh giá', FiMessageCircle], ['/reports', 'Thống kê', FiPieChart],
];

export const fieldLabels = {
  fullName: 'Họ tên', phone: 'Số điện thoại', email: 'Email', gender: 'Giới tính',
  customerType: 'Loại khách', status: 'Trạng thái', position: 'Chức vụ', salary: 'Lương',
  name: 'Tên', description: 'Mô tả', categoryName: 'Danh mục', price: 'Giá tiền',
  duration: 'Thời gian (phút)', customerName: 'Khách hàng', serviceName: 'Dịch vụ',
  employeeName: 'Nhân viên', roomName: 'Phòng', appointmentDate: 'Ngày hẹn',
  startTime: 'Giờ bắt đầu', type: 'Loại phòng', capacity: 'Sức chứa',
  createdAt: 'Ngày tạo', totalAmount: 'Tổng tiền', discountAmount: 'Giảm giá',
  finalAmount: 'Thành tiền', paymentMethod: 'Phương thức thanh toán',
  paymentStatus: 'Trạng thái thanh toán', invoiceId: 'Mã hóa đơn', amount: 'Số tiền',
  paymentDate: 'Ngày thanh toán', code: 'Mã khuyến mãi', discountType: 'Loại giảm giá',
  discountValue: 'Giá trị giảm', discountPercent: 'Phần trăm giảm',
  startDate: 'Ngày bắt đầu', endDate: 'Ngày kết thúc', rating: 'Số sao', comment: 'Nhận xét',
  username: 'Tên tài khoản', password: 'Mật khẩu', roleName: 'Vai trò'
};
