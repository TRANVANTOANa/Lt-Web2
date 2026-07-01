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
import java.util.HashSet;
import java.util.Set;

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
    private final AppointmentDetailRepository appointmentDetailRepository;
    private final InvoiceRepository invoiceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Cơ sở dữ liệu đã có dữ liệu. Bỏ qua bước seed data.");
            return;
        }

        System.out.println("Đang thực hiện seed data mẫu cho ứng dụng Spa...");

        // 1. Tạo các Vai trò (Roles)
        Role roleAdmin = roleRepository.save(Role.builder().roleName("ROLE_ADMIN").description("Quản trị viên hệ thống").build());
        Role roleNhanVien = roleRepository.save(Role.builder().roleName("ROLE_NHAN_VIEN").description("Nhân viên Spa").build());
        Role roleKhachHang = roleRepository.save(Role.builder().roleName("ROLE_KHACH_HANG").description("Khách hàng").build());

        // 2. Tạo Tài khoản Admin mặc định
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Admin Ly")
                .email("admin@spamanagement.com")
                .phone("0987654321")
                .role(roleAdmin)
                .status("ACTIVE")
                .build();
        userRepository.save(admin);

        // Tạo Tài khoản Nhân viên mặc định
        User staffUser = User.builder()
                .username("staff")
                .password(passwordEncoder.encode("staff123"))
                .fullName("Nhân Viên Spa")
                .email("staff@spamanagement.com")
                .phone("0912345678")
                .role(roleNhanVien)
                .status("ACTIVE")
                .build();
        userRepository.save(staffUser);

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

        // 8. Tạo Lịch hẹn cho ngày hôm nay (Appointments & Details)
        LocalDate today = LocalDate.now();

        // Lịch hẹn 1: Nguyễn Thị Lan - 10:00 AM - Sắp đến (DA_XAC_NHAN)
        Appointment app1 = appointmentRepository.save(Appointment.builder()
                .customer(cust1)
                .employee(emp1)
                .room(room1)
                .appointmentDate(today)
                .appointmentTime(LocalTime.of(10, 0))
                .status("DA_XAC_NHAN")
                .note("Khách yêu cầu phòng yên tĩnh")
                .build());
        appointmentDetailRepository.save(AppointmentDetail.builder().appointment(app1).service(svc1).price(svc1.getPrice()).duration(svc1.getDuration()).build());

        // Lịch hẹn 2: Trần Văn Hùng - 11:30 AM - Đang thực hiện (DANG_THUC_HIEN)
        Appointment app2 = appointmentRepository.save(Appointment.builder()
                .customer(cust2)
                .employee(emp2)
                .room(room2)
                .appointmentDate(today)
                .appointmentTime(LocalTime.of(11, 30))
                .status("DANG_THUC_HIEN")
                .note("")
                .build());
        appointmentDetailRepository.save(AppointmentDetail.builder().appointment(app2).service(svc2).price(svc2.getPrice()).duration(svc2.getDuration()).build());

        // Lịch hẹn 3: Lê Thị Mai - 1:00 PM - Đã đặt / Đang chờ (DANG_CHO)
        Appointment app3 = appointmentRepository.save(Appointment.builder()
                .customer(cust3)
                .employee(emp1)
                .room(room1)
                .appointmentDate(today)
                .appointmentTime(LocalTime.of(13, 0))
                .status("DANG_CHO")
                .note("")
                .build());
        appointmentDetailRepository.save(AppointmentDetail.builder().appointment(app3).service(svc3).price(svc3.getPrice()).duration(svc3.getDuration()).build());

        // Lịch hẹn 4: Phạm Hoàng Oanh - 2:30 PM - Sắp đến (DA_XAC_NHAN)
        Appointment app4 = appointmentRepository.save(Appointment.builder()
                .customer(cust4)
                .employee(emp2)
                .room(room3)
                .appointmentDate(today)
                .appointmentTime(LocalTime.of(14, 30))
                .status("DA_XAC_NHAN")
                .note("")
                .build());
        appointmentDetailRepository.save(AppointmentDetail.builder().appointment(app4).service(svc4).price(svc4.getPrice()).duration(svc4.getDuration()).build());

        // 9. Tạo các lịch hẹn đã hoàn thành và hóa đơn thanh toán để tính doanh thu
        // Hôm nay: 15.5M VND doanh thu. Hãy tạo 3 hóa đơn thanh toán có tổng bằng 15.5M
        // Để nhanh gọn, ta tạo các hóa đơn trực tiếp cho ngày hôm nay và các tháng trước.
        createPaidInvoice(cust1, emp1, svc2, today, BigDecimal.valueOf(5500000));
        createPaidInvoice(cust2, emp2, svc1, today, BigDecimal.valueOf(6000000));
        createPaidInvoice(cust3, emp3, svc5, today, BigDecimal.valueOf(4000000)); // Tổng hôm nay = 15,500,000

        // Tạo hóa đơn tháng này nhưng ngày khác để đạt tổng 450M VND
        createPaidInvoice(cust1, emp1, svc1, today.minusDays(2), BigDecimal.valueOf(134500000));
        createPaidInvoice(cust2, emp2, svc2, today.minusDays(5), BigDecimal.valueOf(150000000));
        createPaidInvoice(cust3, emp3, svc3, today.minusDays(8), BigDecimal.valueOf(150000000)); // Tổng tháng này = 450,000,000

        // Tạo hóa đơn cho các tháng trước (để vẽ biểu đồ doanh thu cả năm)
        // Th1: 350M, Th2: 380M, Th3: 410M, Th4: 390M, Th5: 420M, Th6: 450M (nếu tháng hiện tại là Th6)
        // Ta tạo hóa đơn cho từng tháng của năm nay
        int currentYear = today.getYear();
        BigDecimal[] monthlyRevenues = {
                BigDecimal.valueOf(350000000), // Th1
                BigDecimal.valueOf(380000000), // Th2
                BigDecimal.valueOf(410000000), // Th3
                BigDecimal.valueOf(390000000), // Th4
                BigDecimal.valueOf(420000000), // Th5
                BigDecimal.valueOf(450000000), // Th6 (tháng hiện tại)
                BigDecimal.valueOf(480000000), // Th7
                BigDecimal.valueOf(510000000), // Th8
                BigDecimal.valueOf(540000000), // Th9
                BigDecimal.valueOf(560000000), // Th10
                BigDecimal.valueOf(590000000), // Th11
                BigDecimal.valueOf(620000000)  // Th12
        };

        // Seed dữ liệu doanh thu tháng cho biểu đồ
        for (int m = 1; m <= 12; m++) {
            // Chỉ tạo cho các tháng khác tháng hiện tại để tránh đè doanh thu tháng hiện tại
            if (m != today.getMonthValue()) {
                LocalDate dateInMonth = LocalDate.of(currentYear, m, 15);
                createPaidInvoice(cust4, emp4, svc1, dateInMonth, monthlyRevenues[m - 1]);
            }
        }

        System.out.println("Hoàn thành seed data mẫu thành công!");
    }

    private void createPaidInvoice(Customer customer, Employee employee, SpaService service, LocalDate date, BigDecimal finalAmount) {
        Appointment app = appointmentRepository.save(Appointment.builder()
                .customer(customer)
                .employee(employee)
                .appointmentDate(date)
                .appointmentTime(LocalTime.of(9, 0))
                .status("HOAN_THANH")
                .build());

        appointmentDetailRepository.save(AppointmentDetail.builder()
                .appointment(app)
                .service(service)
                .price(service.getPrice())
                .duration(service.getDuration())
                .build());

        Invoice invoice = Invoice.builder()
                .appointment(app)
                .customer(customer)
                .employee(employee)
                .totalAmount(finalAmount)
                .discountAmount(BigDecimal.ZERO)
                .finalAmount(finalAmount)
                .paymentStatus("DA_THANH_TOAN")
                .build();
        
        Invoice savedInvoice = invoiceRepository.save(invoice);
        
        // Cần chỉnh sửa ngày tạo của hóa đơn thủ công để khớp với tháng mong muốn
        savedInvoice.setCreatedAt(date.atTime(10, 0));
        invoiceRepository.save(savedInvoice);
    }
}
