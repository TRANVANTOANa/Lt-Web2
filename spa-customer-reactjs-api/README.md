# Spa Customer ReactJS API

Giao diện khách hàng ReactJS cho hệ thống quản lý Spa. Project đã nối API Spring Boot bằng Axios.

## Cách chạy

```bash
npm install
npm run dev
```

Mở trình duyệt:

```text
http://localhost:5173
```

## Cấu hình API

Mặc định React gọi API tại:

```text
http://localhost:8080/api
```

Có thể đổi trong file `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

## Các API đã nối

- `POST /api/auth/login` đăng nhập
- `POST /api/auth/register` đăng ký
- `GET /api/spa-services` danh sách dịch vụ
- `GET /api/spa-services/{id}` chi tiết dịch vụ
- `GET /api/service-categories` danh mục dịch vụ
- `GET /api/employees/status/DANG_LAM` nhân viên đang làm
- `GET /api/rooms/status/TRONG` phòng trống
- `POST /api/customers` tạo khách hàng khi đặt lịch
- `GET /api/customers/search?keyword=...` tìm khách hàng theo SĐT/email/tên
- `POST /api/appointments` tạo lịch hẹn
- `PATCH /api/appointments/{id}/status` hủy lịch hẹn
- `GET /api/appointments/customer/{customerId}` lịch sử đặt lịch
- `GET /api/appointments/{id}` chi tiết lịch hẹn
- `GET /api/invoices/customer/{customerId}` hóa đơn khách hàng
- `POST /api/invoices/{id}/payment` thanh toán hóa đơn
- `GET /api/reviews/service/{serviceId}` xem đánh giá
- `POST /api/reviews` gửi đánh giá

## Lưu ý backend

Spring Boot cần chạy cổng `8080` và đã copy các Controller/API vào package:

```text
src/main/java/toanweb2/DoAnWeb2/controller
```

Nếu frontend gọi API bị lỗi JSON do quan hệ Entity vòng lặp hoặc Lazy Loading, thêm `@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})` hoặc dùng DTO ở backend.
