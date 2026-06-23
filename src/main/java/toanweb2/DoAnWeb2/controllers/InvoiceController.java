package toanweb2.DoAnWeb2.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import toanweb2.DoAnWeb2.entity.Invoice;
import toanweb2.DoAnWeb2.service.InvoiceService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@CrossOrigin("*")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        return invoiceService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Invoice>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(invoiceService.findByCustomerId(customerId));
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.save(invoice));
    }

    @PutMapping("/{id}/payment")
    public ResponseEntity<Invoice> processPayment(@PathVariable Long id, @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(invoiceService.processPayment(id, request.paymentMethod()));
    }

    @GetMapping("/revenue/day")
    public ResponseEntity<Map<String, BigDecimal>> revenueByDay(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(Map.of("revenue", invoiceService.calculateRevenueByDay(date)));
    }

    @GetMapping("/revenue/month")
    public ResponseEntity<Map<String, BigDecimal>> revenueByMonth(
            @RequestParam int year,
            @RequestParam int month
    ) {
        return ResponseEntity.ok(Map.of("revenue", invoiceService.calculateRevenueByMonth(year, month)));
    }

    @GetMapping("/revenue/year")
    public ResponseEntity<Map<String, BigDecimal>> revenueByYear(@RequestParam int year) {
        return ResponseEntity.ok(Map.of("revenue", invoiceService.calculateRevenueByYear(year)));
    }

    public record PaymentRequest(String paymentMethod) {}
}
