package toanweb2.DoAnWeb2.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import toanweb2.DoAnWeb2.entity.Appointment;
import toanweb2.DoAnWeb2.entity.Customer;
import toanweb2.DoAnWeb2.entity.Employee;
import toanweb2.DoAnWeb2.entity.Room;
import toanweb2.DoAnWeb2.entity.SpaService;
import toanweb2.DoAnWeb2.repository.CustomerRepository;
import toanweb2.DoAnWeb2.repository.EmployeeRepository;
import toanweb2.DoAnWeb2.repository.RoomRepository;
import toanweb2.DoAnWeb2.service.EmailService;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.time.Year;
import java.util.Locale;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final RoomRepository roomRepository;
    private final org.springframework.mail.javamail.JavaMailSender mailSender;

    private boolean isCustomerBookingFlow() {
        try {
            org.springframework.security.core.Authentication auth = 
                    org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return false;
            }
            return auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_KHACH_HANG") 
                            || a.getAuthority().equals("ROLE_CUSTOMER"));
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void sendBookingEmail(Appointment saved, java.util.List<SpaService> services, BigDecimal discountAmount, BigDecimal finalAmount, boolean isVNPayPaid) {
        // Only send if it is customer booking flow or if it is a successful VNPay payment callback
        if (!isCustomerBookingFlow() && !isVNPayPaid) {
            return;
        }

        CompletableFuture.runAsync(() -> {
            try {
                String customerEmail = null;
                String customerName = "Khách hàng";
                if (saved.getCustomer() != null && saved.getCustomer().getId() != null) {
                    Customer customer = customerRepository.findById(saved.getCustomer().getId()).orElse(null);
                    if (customer != null) {
                        customerEmail = customer.getEmail();
                        customerName = customer.getFullName();
                    }
                }

                if (customerEmail == null || customerEmail.isBlank()) {
                    return;
                }

                String employeeName = "Tự động phân phối";
                if (saved.getEmployee() != null && saved.getEmployee().getId() != null) {
                    Employee emp = employeeRepository.findById(saved.getEmployee().getId()).orElse(null);
                    if (emp != null) {
                        employeeName = emp.getFullName();
                    }
                }

                String roomName = "Tự động phân phối";
                if (saved.getRoom() != null && saved.getRoom().getId() != null) {
                    Room rm = roomRepository.findById(saved.getRoom().getId()).orElse(null);
                    if (rm != null) {
                        roomName = rm.getRoomName();
                    }
                }

                StringBuilder servicesHtml = new StringBuilder();
                NumberFormat vndFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
                for (SpaService s : services) {
                    servicesHtml.append("<tr style='border-bottom: 1px solid #eee;'>")
                                .append("<td style='padding: 10px 0;'>").append(s.getName()).append("</td>")
                                .append("<td style='padding: 10px 0; text-align: right;'>").append(vndFormat.format(s.getPrice())).append("</td>")
                                .append("</tr>");
                }

                String formattedDate = saved.getAppointmentDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                String formattedTime = saved.getAppointmentTime().toString();
                String note = (saved.getNote() != null && !saved.getNote().isBlank()) ? saved.getNote() : "Không có ghi chú";

                String headerTitle = isVNPayPaid ? "THANH TOÁN & ĐẶT LỊCH THÀNH CÔNG" : "ĐẶT LỊCH HẸN THÀNH CÔNG";
                String subjectText = isVNPayPaid ? "[Spa Beauty] Thanh toán và xác nhận lịch hẹn #" + saved.getId() : "[Spa Beauty] Xác nhận lịch hẹn #" + saved.getId();
                String paymentStatusText = isVNPayPaid ? "Đã thanh toán trực tuyến qua VNPay" : "Chưa thanh toán (Thanh toán bằng tiền mặt tại spa)";

                // Giảm giá section
                String discountSectionHtml = "";
                if (discountAmount != null && discountAmount.compareTo(BigDecimal.ZERO) > 0) {
                    discountSectionHtml = "<div style='text-align: right; font-size: 14px; color: #777; margin-top: 10px;'>" +
                            "Giảm giá khuyến mãi: -" + vndFormat.format(discountAmount) +
                            "</div>";
                }

                String htmlMsg = "<!DOCTYPE html>" +
                        "<html>" +
                        "<head>" +
                        "<meta charset='utf-8'>" +
                        "<style>" +
                        "body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f9fc; color: #333; margin: 0; padding: 0; }" +
                        ".container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #f2d9e6; }" +
                        ".header { background: linear-gradient(135deg, #e85d8c, #f48fb1); padding: 30px; text-align: center; color: #fff; }" +
                        ".header h2 { margin: 0; font-size: 24px; font-weight: 700; }" +
                        ".content { padding: 30px; line-height: 1.6; }" +
                        ".content h3 { color: #e85d8c; margin-top: 0; font-size: 18px; border-bottom: 2px solid #fff0f5; padding-bottom: 8px; }" +
                        ".info-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }" +
                        ".info-table td { padding: 8px 0; vertical-align: top; }" +
                        ".info-table td.label { width: 35%; color: #777; font-weight: 600; }" +
                        ".info-table td.value { color: #333; font-weight: 700; }" +
                        ".services-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }" +
                        ".services-table th { border-bottom: 2px solid #e85d8c; padding-bottom: 10px; text-align: left; color: #e85d8c; }" +
                        ".services-table td { font-size: 14px; }" +
                        ".total-section { background-color: #fff0f5; padding: 15px; border-radius: 8px; text-align: right; font-size: 18px; font-weight: 700; color: #e85d8c; margin-top: 15px; }" +
                        ".footer { background-color: #fafafa; padding: 20px; text-align: center; font-size: 13px; color: #888; border-top: 1px solid #eee; }" +
                        "</style>" +
                        "</head>" +
                        "<body>" +
                        "<div class='container'>" +
                        "  <div class='header'>" +
                        "    <h2>" + headerTitle + "</h2>" +
                        "  </div>" +
                        "  <div class='content'>" +
                        "    <p>Xin chào <strong>" + customerName + "</strong>,</p>" +
                        "    <p>Cảm ơn bạn đã lựa chọn <strong>Spa Beauty</strong>. Lịch hẹn của bạn đã được ghi nhận thành công trên hệ thống. Dưới đây là thông tin chi tiết cuộc hẹn:</p>" +
                        "    <h3>THÔNG TIN LỊCH HẸN</h3>" +
                        "    <table class='info-table'>" +
                        "      <tr>" +
                        "        <td class='label'>Mã lịch hẹn:</td>" +
                        "        <td class='value'>#" + saved.getId() + "</td>" +
                        "      </tr>" +
                        "      <tr>" +
                        "        <td class='label'>Ngày hẹn:</td>" +
                        "        <td class='value'>" + formattedDate + "</td>" +
                        "      </tr>" +
                        "      <tr>" +
                        "        <td class='label'>Giờ hẹn:</td>" +
                        "        <td class='value'>" + formattedTime + "</td>" +
                        "      </tr>" +
                        "      <tr>" +
                        "        <td class='label'>Kỹ thuật viên:</td>" +
                        "        <td class='value'>" + employeeName + "</td>" +
                        "      </tr>" +
                        "      <tr>" +
                        "        <td class='label'>Phòng:</td>" +
                        "        <td class='value'>" + roomName + "</td>" +
                        "      </tr>" +
                        "      <tr>" +
                        "        <td class='label'>Trạng thái thanh toán:</td>" +
                        "        <td class='value' style='color: " + (isVNPayPaid ? "#148a55" : "#b7791f") + ";'>" + paymentStatusText + "</td>" +
                        "      </tr>" +
                        "      <tr>" +
                        "        <td class='label'>Ghi chú:</td>" +
                        "        <td class='value'>" + note + "</td>" +
                        "      </tr>" +
                        "    </table>" +
                        "    <h3>DỊCH VỤ ĐÃ ĐẶT</h3>" +
                        "    <table class='services-table'>" +
                        "      <thead>" +
                        "        <tr>" +
                        "          <th style='text-align: left; padding-bottom: 8px;'>Dịch vụ</th>" +
                        "          <th style='text-align: right; padding-bottom: 8px;'>Đơn giá</th>" +
                        "        </tr>" +
                        "      </thead>" +
                        "      <tbody>" +
                        "        " + servicesHtml.toString() +
                        "      </tbody>" +
                        "    </table>" +
                        "    " + discountSectionHtml +
                        "    <div class='total-section'>" +
                        "      Tổng thanh toán: " + vndFormat.format(finalAmount) +
                        "    </div>" +
                        "  </div>" +
                        "  <div class='footer'>" +
                        "    <p>Nếu bạn cần thay đổi hoặc hỗ trợ về lịch hẹn, vui lòng gọi <strong>Hotline: 1900 xxxx</strong>.</p>" +
                        "    <p>&copy; " + Year.now().getValue() + " Spa Beauty. All rights reserved.</p>" +
                        "  </div>" +
                        "</div>" +
                        "</body>" +
                        "</html>";

                jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
                org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, "utf-8");
                helper.setFrom("pukachi1132@gmail.com", "Spa Beauty");
                helper.setTo(customerEmail);
                helper.setSubject(subjectText);
                helper.setText(htmlMsg, true);

                mailSender.send(mimeMessage);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }
}
