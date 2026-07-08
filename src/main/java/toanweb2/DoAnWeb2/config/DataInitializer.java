package toanweb2.DoAnWeb2.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import toanweb2.DoAnWeb2.entity.*;
import toanweb2.DoAnWeb2.repository.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final SpaServiceRepository spaServiceRepository;
    private final AppointmentRepository appointmentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Đang thực hiện kiểm tra và seed data mẫu cho ứng dụng Spa...");

        // 1. Tạo hoặc lấy các Vai trò (Roles)
        Role roleAdmin = roleRepository.findByRoleName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().roleName("ROLE_ADMIN").description("Quản trị viên hệ thống").build()));
        Role roleNhanVien = roleRepository.findByRoleName("ROLE_NHAN_VIEN")
                .orElseGet(() -> roleRepository.save(Role.builder().roleName("ROLE_NHAN_VIEN").description("Nhân viên Spa").build()));
        Role roleKhachHang = roleRepository.findByRoleName("ROLE_KHACH_HANG")
                .orElseGet(() -> roleRepository.save(Role.builder().roleName("ROLE_KHACH_HANG").description("Khách hàng").build()));

        // 2. Tạo hoặc cập nhật Tài khoản Admin mặc định
        User admin = userRepository.findByUsername("admin").orElse(null);
        if (admin == null) {
            admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Admin Ly")
                    .email("admin@spamanagement.com")
                    .phone("0987654321")
                    .role(roleAdmin)
                    .status("ACTIVE")
                    .build();
            userRepository.save(admin);
            System.out.println("Đã tạo tài khoản admin mặc định.");
        } else if (admin.getRole() == null) {
            admin.setRole(roleAdmin);
            userRepository.save(admin);
            System.out.println("Đã cập nhật vai trò ROLE_ADMIN cho tài khoản admin.");
        }

        // Tạo hoặc cập nhật Tài khoản Nhân viên mặc định
        User staffUser = userRepository.findByUsername("staff").orElse(null);
        if (staffUser == null) {
            staffUser = User.builder()
                    .username("staff")
                    .password(passwordEncoder.encode("staff123"))
                    .fullName("Nhân Viên Spa")
                    .email("staff@spamanagement.com")
                    .phone("0912345678")
                    .role(roleNhanVien)
                    .status("ACTIVE")
                    .build();
            userRepository.save(staffUser);
            System.out.println("Đã tạo tài khoản staff mặc định.");
        } else if (staffUser.getRole() == null) {
            staffUser.setRole(roleNhanVien);
            userRepository.save(staffUser);
            System.out.println("Đã cập nhật vai trò ROLE_NHAN_VIEN cho tài khoản staff.");
        }

        // Tạo hoặc cập nhật Tài khoản Khách hàng mẫu
        User customerUser = userRepository.findByUsername("khachhang").orElse(null);
        if (customerUser == null) {
            customerUser = User.builder()
                    .username("khachhang")
                    .password(passwordEncoder.encode("khachhang123"))
                    .fullName("Nguyễn Thị Lan")
                    .email("lan.nguyen@gmail.com")
                    .phone("0912223334")
                    .role(roleKhachHang)
                    .status("ACTIVE")
                    .build();
            userRepository.save(customerUser);
            System.out.println("Đã tạo tài khoản khachhang mặc định.");
        } else if (customerUser.getRole() == null) {
            customerUser.setRole(roleKhachHang);
            userRepository.save(customerUser);
            System.out.println("Đã cập nhật vai trò ROLE_KHACH_HANG cho tài khoản khachhang.");
        }

        if (spaServiceRepository.count() > 0) {
            System.out.println("Đã có dịch vụ Spa trong cơ sở dữ liệu. Bỏ qua các bước seed dữ liệu phòng, dịch vụ, khách hàng, lịch hẹn.");
            return;
        }

        // 3. Tạo các Phòng (Rooms)
        Room room1 = roomRepository.save(Room.builder().roomName("Phòng VIP 1").description("Phòng trị liệu cao cấp 1").status("TRONG").build());
        Room room2 = roomRepository.save(Room.builder().roomName("Phòng VIP 2").description("Phòng trị liệu cao cấp 2").status("TRONG").build());
        Room room3 = roomRepository.save(Room.builder().roomName("Phòng Thường 1").description("Phòng trị liệu tiêu chuẩn 1").status("TRONG").build());
        Room room4 = roomRepository.save(Room.builder().roomName("Phòng Thường 2").description("Phòng trị liệu tiêu chuẩn 2").status("TRONG").build());

        // 4. Tạo Nhân viên (Employees)
        Employee emp1 = employeeRepository.save(Employee.builder().fullName("Nguyễn Văn A").phone("0981111111").email("a.nguyen@spamanagement.com").gender("Nam").position("KY_THUAT").salary(BigDecimal.valueOf(8000000)).status("DANG_LAM").build());
        Employee emp2 = employeeRepository.save(Employee.builder().fullName("Trần Thị B").phone("0982222222").email("b.tran@spamanagement.com").gender("Nữ").position("KY_THUAT").salary(BigDecimal.valueOf(8500000)).status("DANG_LAM").build());
        Employee emp3 = employeeRepository.save(Employee.builder().fullName("Lê Văn C").phone("0983333333").email("c.le@spamanagement.com").gender("Nam").position("LE_TAN").salary(BigDecimal.valueOf(7000000)).status("DANG_LAM").build());
        Employee emp4 = employeeRepository.save(Employee.builder().fullName("Phạm Thị D").phone("0984444444").email("d.pham@spamanagement.com").gender("Nữ").position("QUAN_LY").salary(BigDecimal.valueOf(15000000)).status("DANG_LAM").build());

        // 5. Tạo Khách hàng (Customers)
        Customer cust1 = customerRepository.save(Customer.builder().fullName("Nguyễn Thị Lan").phone("0912223334").email("lan.nguyen@gmail.com").gender("Nữ").birthday(LocalDate.of(1995, 8, 12)).address("Quận 1, TP. HCM").customerType("VIP").build());
        Customer cust2 = customerRepository.save(Customer.builder().fullName("Trần Văn Hùng").phone("0913334445").email("hung.tran@gmail.com").gender("Nam").birthday(LocalDate.of(1990, 5, 20)).address("Quận 3, TP. HCM").customerType("THUONG").build());
        Customer cust3 = customerRepository.save(Customer.builder().fullName("Lê Thị Mai").phone("0914445556").email("mai.le@gmail.com").gender("Nữ").birthday(LocalDate.of(1988, 11, 3)).address("Quận Bình Thạnh, TP. HCM").customerType("THAN_THIET").build());
        Customer cust4 = customerRepository.save(Customer.builder().fullName("Phạm Hoàng Oanh").phone("0915556667").email("oanh.pham@gmail.com").gender("Nữ").birthday(LocalDate.of(1998, 2, 28)).address("Quận 7, TP. HCM").customerType("THUONG").build());

        // 6. Tạo Danh mục Dịch vụ (ServiceCategories)
        ServiceCategory catMassage = serviceCategoryRepository.save(ServiceCategory.builder().name("Dịch vụ Massage").description("Các liệu trình massage thư giãn và trị liệu cơ thể").status("ACTIVE").build());
        ServiceCategory catChamsocDa = serviceCategoryRepository.save(ServiceCategory.builder().name("Chăm sóc da").description("Liệu trình chăm sóc và trẻ hóa da mặt chuyên sâu").status("ACTIVE").build());
        ServiceCategory catGoidau = serviceCategoryRepository.save(ServiceCategory.builder().name("Gội đầu").description("Gội đầu dưỡng sinh bằng thảo dược tự nhiên").status("ACTIVE").build());
        ServiceCategory catTayDaChet = serviceCategoryRepository.save(ServiceCategory.builder().name("Tẩy tế bào chết").description("Tẩy sạch tế bào chết toàn thân hoặc mặt").status("ACTIVE").build());
        ServiceCategory catXongHoi = serviceCategoryRepository.save(ServiceCategory.builder().name("Liệu pháp xông hơi").description("Xông hơi đá muối thải độc cơ thể").status("ACTIVE").build());

        // 7. Tạo Dịch vụ Spa (SpaServices)
        SpaService svc1 = spaServiceRepository.save(SpaService.builder().category(catMassage).name("Massage thư giãn").description("Massage body tinh dầu giúp giải tỏa căng thẳng").price(BigDecimal.valueOf(300000)).duration(60).status("ACTIVE").build());
        SpaService svc2 = spaServiceRepository.save(SpaService.builder().category(catChamsocDa).name("Chăm sóc da mặt").description("Chăm sóc da mặt cơ bản kết hợp mặt nạ tự nhiên").price(BigDecimal.valueOf(400000)).duration(75).status("ACTIVE").build());
        SpaService svc3 = spaServiceRepository.save(SpaService.builder().category(catGoidau).name("Gội đầu thảo dược").description("Gội đầu thảo dược kết hợp bấm huyệt trị liệu vai gáy").price(BigDecimal.valueOf(150000)).duration(45).status("ACTIVE").build());
        SpaService svc4 = spaServiceRepository.save(SpaService.builder().category(catTayDaChet).name("Tẩy tế bào chết").description("Tẩy tế bào chết toàn thân bằng hạt cafe và muối khoáng").price(BigDecimal.valueOf(200000)).duration(40).status("ACTIVE").build());
        SpaService svc5 = spaServiceRepository.save(SpaService.builder().category(catXongHoi).name("Xông hơi đá muối").description("Xông hơi đá muối Hymalaya đào thải độc tố").price(BigDecimal.valueOf(250000)).duration(50).status("ACTIVE").build());

        // 8. Tạo Lịch hẹn cho ngày hôm nay
        // Service, price, duration đã được gộp trực tiếp vào Appointment
        LocalDate today = LocalDate.now();

        // Lịch hẹn 1: Nguyễn Thị Lan - 10:00 - Sắp đến (DA_XAC_NHAN)
        appointmentRepository.save(Appointment.builder()
                .customer(cust1).employee(emp1).room(room1).service(svc1)
                .appointmentDate(today).appointmentTime(LocalTime.of(10, 0))
                .duration(svc1.getDuration()).price(svc1.getPrice())
                .status("DA_XAC_NHAN").note("Khách yêu cầu phòng yên tĩnh")
                .build());

        // Lịch hẹn 2: Trần Văn Hùng - 11:30 - Đang thực hiện (DANG_THUC_HIEN)
        appointmentRepository.save(Appointment.builder()
                .customer(cust2).employee(emp2).room(room2).service(svc2)
                .appointmentDate(today).appointmentTime(LocalTime.of(11, 30))
                .duration(svc2.getDuration()).price(svc2.getPrice())
                .status("DANG_THUC_HIEN").note("")
                .build());

        // Lịch hẹn 3: Lê Thị Mai - 13:00 - Đang chờ (DANG_CHO)
        appointmentRepository.save(Appointment.builder()
                .customer(cust3).employee(emp1).room(room1).service(svc3)
                .appointmentDate(today).appointmentTime(LocalTime.of(13, 0))
                .duration(svc3.getDuration()).price(svc3.getPrice())
                .status("DANG_CHO").note("")
                .build());

        // Lịch hẹn 4: Phạm Hoàng Oanh - 14:30 - Sắp đến (DA_XAC_NHAN)
        appointmentRepository.save(Appointment.builder()
                .customer(cust4).employee(emp2).room(room3).service(svc4)
                .appointmentDate(today).appointmentTime(LocalTime.of(14, 30))
                .duration(svc4.getDuration()).price(svc4.getPrice())
                .status("DA_XAC_NHAN").note("")
                .build());

        // 9. Tạo các lịch hẹn đã hoàn thành và hóa đơn để tính doanh thu
        createPaidInvoice(cust1, emp1, svc2, today, BigDecimal.valueOf(5500000));
        createPaidInvoice(cust2, emp2, svc1, today, BigDecimal.valueOf(6000000));
        createPaidInvoice(cust3, emp3, svc5, today, BigDecimal.valueOf(4000000)); // Tổng hôm nay = 15,500,000

        // Dữ liệu tháng này (các ngày trước)
        createPaidInvoice(cust1, emp1, svc1, today.minusDays(2), BigDecimal.valueOf(134500000));
        createPaidInvoice(cust2, emp2, svc2, today.minusDays(5), BigDecimal.valueOf(150000000));
        createPaidInvoice(cust3, emp3, svc3, today.minusDays(8), BigDecimal.valueOf(150000000)); // Tổng tháng này = 450,000,000

        // Dữ liệu biểu đồ doanh thu cả năm
        int currentYear = today.getYear();
        BigDecimal[] monthlyRevenues = {
                BigDecimal.valueOf(350000000), // Th1
                BigDecimal.valueOf(380000000), // Th2
                BigDecimal.valueOf(410000000), // Th3
                BigDecimal.valueOf(390000000), // Th4
                BigDecimal.valueOf(420000000), // Th5
                BigDecimal.valueOf(450000000), // Th6
                BigDecimal.valueOf(480000000), // Th7
                BigDecimal.valueOf(510000000), // Th8
                BigDecimal.valueOf(540000000), // Th9
                BigDecimal.valueOf(560000000), // Th10
                BigDecimal.valueOf(590000000), // Th11
                BigDecimal.valueOf(620000000)  // Th12
        };

        for (int m = 1; m <= 12; m++) {
            if (m != today.getMonthValue()) {
                LocalDate dateInMonth = LocalDate.of(currentYear, m, 15);
                createPaidInvoice(cust4, emp4, svc1, dateInMonth, monthlyRevenues[m - 1]);
            }
        }

        System.out.println("Hoàn thành seed data mẫu thành công!");
    }

    /**
     * Tạo lịch hẹn hoàn thành + hóa đơn đã thanh toán.
     * Appointment nay đã có trực tiếp service, price, duration (không cần AppointmentDetail).
     * Invoice nay đã có trực tiếp paymentMethod, paidAt (không cần Payment riêng).
     */
    private void createPaidInvoice(Customer customer, Employee employee, SpaService service, LocalDate date, BigDecimal finalAmount) {
        Appointment app = appointmentRepository.save(Appointment.builder()
                .customer(customer)
                .employee(employee)
                .service(service)
                .appointmentDate(date)
                .appointmentTime(LocalTime.of(9, 0))
                .duration(service.getDuration())
                .price(service.getPrice())
                .status("HOAN_THANH")
                .build());

        Invoice invoice = Invoice.builder()
                .appointment(app)
                .customer(customer)
                .employee(employee)
                .totalAmount(finalAmount)
                .discountAmount(BigDecimal.ZERO)
                .finalAmount(finalAmount)
                .paymentMethod("TIEN_MAT")
                .paymentStatus("DA_THANH_TOAN")
                .paidAt(date.atTime(10, 0))
                .build();

        Invoice savedInvoice = invoiceRepository.save(invoice);

        // Điều chỉnh createdAt để khớp với tháng mong muốn cho biểu đồ doanh thu
        savedInvoice.setCreatedAt(date.atTime(10, 0));
        invoiceRepository.save(savedInvoice);
    }
}
