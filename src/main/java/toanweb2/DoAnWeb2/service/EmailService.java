package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.Appointment;
import toanweb2.DoAnWeb2.entity.SpaService;
import java.math.BigDecimal;
import java.util.List;

public interface EmailService {
    void sendBookingEmail(Appointment saved, List<SpaService> services, BigDecimal discountAmount, BigDecimal finalAmount, boolean isVNPayPaid);
}
