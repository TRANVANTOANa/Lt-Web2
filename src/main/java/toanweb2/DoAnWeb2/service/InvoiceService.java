package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.Invoice;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface InvoiceService {
    List<Invoice> findAll();
    Optional<Invoice> findById(Long id);
    List<Invoice> findByCustomerId(Long customerId);
    Invoice save(Invoice invoice);
    Invoice processPayment(Long invoiceId, String paymentMethod);
    BigDecimal calculateRevenueByDay(LocalDate date);
    BigDecimal calculateRevenueByMonth(int year, int month);
    BigDecimal calculateRevenueByYear(int year);
}
