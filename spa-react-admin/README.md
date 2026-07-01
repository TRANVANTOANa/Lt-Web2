# Spa React Admin

Giao diện quản trị React cho đề tài **Quản lý Spa Java Spring Boot**.

## Cách chạy

```bash
npm install
npm run dev
```

Mở trình duyệt:

```text
http://localhost:5173
```

Tài khoản demo:

```text
admin / 123456
```

## API Spring Boot

Mặc định React gọi API:

```text
http://localhost:8080/api
```

Đổi API bằng file `.env`:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

## Trang có sẵn

- Login
- Dashboard
- Khách hàng
- Nhân viên
- Danh mục dịch vụ
- Dịch vụ Spa
- Lịch hẹn
- Phòng
- Hóa đơn
- Thanh toán
- Khuyến mãi
- Đánh giá
- Thống kê

Khi Spring Boot chưa chạy, giao diện dùng dữ liệu mẫu để demo. Khi API chạy đúng endpoint, React sẽ gọi dữ liệu thật bằng Axios.
