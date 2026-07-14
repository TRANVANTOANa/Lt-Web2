package toanweb2.DoAnWeb2.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import toanweb2.DoAnWeb2.entity.Appointment;
import toanweb2.DoAnWeb2.entity.Invoice;
import toanweb2.DoAnWeb2.repository.AppointmentRepository;
import toanweb2.DoAnWeb2.repository.InvoiceRepository;
import toanweb2.DoAnWeb2.repository.PromotionRepository;
import toanweb2.DoAnWeb2.service.AppointmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PromotionRepository promotionRepository;
    private final toanweb2.DoAnWeb2.repository.SpaServiceRepository spaServiceRepository;
    private final toanweb2.DoAnWeb2.service.EmailService emailService;

    @Override
    public List<Appointment> findAll() {
        return appointmentRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
    }

    @Override
    public Optional<Appointment> findById(Long id) {
        return appointmentRepository.findById(id);
    }

    @Override
    public List<Appointment> findByCustomerId(Long customerId) {
        return appointmentRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Appointment> findByEmployeeId(Long employeeId) {
        return appointmentRepository.findByEmployeeId(employeeId);
    }

    @Override
    public List<Appointment> findByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    private void mapDetailsToAppointment(Appointment appointment) {
        java.util.List<java.util.Map<String, Object>> details = appointment.getAppointmentDetails();
        if (details != null && !details.isEmpty()) {
            // Map primary/first service for legacy column support
            java.util.Map<String, Object> firstDetail = details.get(0);
            if (appointment.getService() == null && firstDetail.get("service") instanceof java.util.Map) {
                java.util.Map<?, ?> svcMap = (java.util.Map<?, ?>) firstDetail.get("service");
                Object svcIdObj = svcMap.get("id");
                if (svcIdObj != null) {
                    Long svcId = Long.valueOf(svcIdObj.toString());
                    toanweb2.DoAnWeb2.entity.SpaService svc = new toanweb2.DoAnWeb2.entity.SpaService();
                    svc.setId(svcId);
                    appointment.setService(svc);
                }
            }
            if (appointment.getPrice() == null && firstDetail.get("price") != null) {
                appointment.setPrice(new java.math.BigDecimal(firstDetail.get("price").toString()));
            }
            if (appointment.getDuration() == null && firstDetail.get("duration") != null) {
                appointment.setDuration(Integer.valueOf(firstDetail.get("duration").toString()));
            }

            // Map all services to the services list
            java.util.List<toanweb2.DoAnWeb2.entity.SpaService> services = new java.util.ArrayList<>();
            for (java.util.Map<String, Object> detail : details) {
                if (detail.get("service") instanceof java.util.Map) {
                    java.util.Map<?, ?> svcMap = (java.util.Map<?, ?>) detail.get("service");
                    Object svcIdObj = svcMap.get("id");
                    if (svcIdObj != null) {
                        Long svcId = Long.valueOf(svcIdObj.toString());
                        toanweb2.DoAnWeb2.entity.SpaService svc = new toanweb2.DoAnWeb2.entity.SpaService();
                        svc.setId(svcId);
                        services.add(svc);
                    }
                }
            }
            appointment.setServices(services);
        }
    }

    @Override
    public Appointment save(Appointment appointment) {
        mapDetailsToAppointment(appointment);
        
        // Resolve promotion if any
        if (appointment.getPromotion() != null) {
            if (appointment.getPromotion().getId() != null) {
                promotionRepository.findById(appointment.getPromotion().getId())
                        .ifPresent(appointment::setPromotion);
            } else if (appointment.getPromotion().getCode() != null) {
                promotionRepository.findByCode(appointment.getPromotion().getCode())
                        .ifPresent(appointment::setPromotion);
            }
        }

        Appointment saved = appointmentRepository.save(appointment);

        // Nạp đầy đủ thông tin các SpaService từ Database để tính tổng tiền và gửi Mail
        java.util.List<toanweb2.DoAnWeb2.entity.SpaService> fullServices = new java.util.ArrayList<>();
        java.math.BigDecimal totalAmount = java.math.BigDecimal.ZERO;
        if (saved.getServices() != null && !saved.getServices().isEmpty()) {
            for (toanweb2.DoAnWeb2.entity.SpaService svc : saved.getServices()) {
                toanweb2.DoAnWeb2.entity.SpaService fullSvc = spaServiceRepository.findById(svc.getId()).orElse(null);
                if (fullSvc != null) {
                    fullServices.add(fullSvc);
                    if (fullSvc.getPrice() != null) {
                        totalAmount = totalAmount.add(fullSvc.getPrice());
                    }
                }
            }
        } else if (saved.getService() != null) {
            toanweb2.DoAnWeb2.entity.SpaService fullSvc = spaServiceRepository.findById(saved.getService().getId()).orElse(null);
            if (fullSvc != null) {
                fullServices.add(fullSvc);
                if (fullSvc.getPrice() != null) {
                    totalAmount = fullSvc.getPrice();
                }
            }
        } else if (saved.getPrice() != null) {
            totalAmount = saved.getPrice();
        }

        java.math.BigDecimal discountAmount = java.math.BigDecimal.ZERO;
        if (saved.getPromotion() != null) {
            toanweb2.DoAnWeb2.entity.Promotion promo = saved.getPromotion();
            if ("PERCENT".equals(promo.getDiscountType())) {
                discountAmount = totalAmount.multiply(promo.getDiscountValue()).divide(java.math.BigDecimal.valueOf(100));
            } else if ("AMOUNT".equals(promo.getDiscountType())) {
                discountAmount = promo.getDiscountValue();
            }
        }
        java.math.BigDecimal finalAmount = totalAmount.subtract(discountAmount);
        if (finalAmount.compareTo(java.math.BigDecimal.ZERO) < 0) {
            finalAmount = java.math.BigDecimal.ZERO;
        }

        // Auto-create unpaid Invoice
        Invoice invoice = Invoice.builder()
                .appointment(saved)
                .customer(saved.getCustomer())
                .employee(saved.getEmployee())
                .promotion(saved.getPromotion())
                .totalAmount(totalAmount)
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .paymentMethod(appointment.getPaymentMethod() != null && !appointment.getPaymentMethod().isBlank() ? appointment.getPaymentMethod() : "TIEN_MAT")
                .paymentStatus("CHUA_THANH_TOAN")
                .build();
        invoiceRepository.save(invoice);

        // Gửi email xác nhận lịch hẹn (chỉ cho luồng đặt lịch của khách hàng dùng TIEN_MAT)
        // Nếu đặt bằng VNPay thì sẽ gửi mail sau khi thanh toán VNPay thành công tại callback
        if (!"VNPAY".equalsIgnoreCase(appointment.getPaymentMethod())) {
            emailService.sendBookingEmail(saved, fullServices, discountAmount, finalAmount, false);
        }

        return saved;
    }

    @Override
    public Appointment update(Long id, Appointment appointment) {
        Appointment existing = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn với ID: " + id));
        mapDetailsToAppointment(appointment);
        existing.setCustomer(appointment.getCustomer());
        existing.setEmployee(appointment.getEmployee());
        existing.setRoom(appointment.getRoom());
        existing.setService(appointment.getService());
        existing.setServices(appointment.getServices());
        existing.setAppointmentDate(appointment.getAppointmentDate());
        existing.setAppointmentTime(appointment.getAppointmentTime());
        existing.setDuration(appointment.getDuration());
        existing.setPrice(appointment.getPrice());
        existing.setNote(appointment.getNote());
        existing.setStatus(appointment.getStatus());
        return appointmentRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        appointmentRepository.deleteById(id);
    }

    @Override
    public Appointment updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn với ID: " + id));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    @Override
    public boolean checkEmployeeConflict(Long employeeId, LocalDate date, LocalTime time, Integer duration) {
        List<Appointment> appointments = appointmentRepository.findByEmployeeIdAndDate(employeeId, date);
        LocalTime endTime = time.plusMinutes(duration);

        for (Appointment a : appointments) {
            LocalTime existingStart = a.getAppointmentTime();
            // Dùng duration trực tiếp từ appointment, mặc định 60 phút nếu null
            int existingDuration = (a.getDuration() != null) ? a.getDuration() : 60;
            LocalTime existingEnd = existingStart.plusMinutes(existingDuration);

            // Kiểm tra trùng thời gian
            if (time.isBefore(existingEnd) && endTime.isAfter(existingStart)) {
                return true; // Có trùng lịch
            }
        }
        return false; // Không trùng
    }

    @Override
    public boolean checkRoomConflict(Long roomId, LocalDate date, LocalTime time, Integer duration) {
        List<Appointment> appointments = appointmentRepository.findByRoomIdAndDate(roomId, date);
        LocalTime endTime = time.plusMinutes(duration);

        for (Appointment a : appointments) {
            LocalTime existingStart = a.getAppointmentTime();
            int existingDuration = (a.getDuration() != null) ? a.getDuration() : 60;
            LocalTime existingEnd = existingStart.plusMinutes(existingDuration);

            if (time.isBefore(existingEnd) && endTime.isAfter(existingStart)) {
                return true; // Có trùng phòng
            }
        }
        return false;
    }
}
