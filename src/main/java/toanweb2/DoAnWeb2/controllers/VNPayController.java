package toanweb2.DoAnWeb2.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import toanweb2.DoAnWeb2.service.VNPayService;

import jakarta.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.Map;

@RestController
@RequestMapping("/api/vnpay")
@RequiredArgsConstructor
@CrossOrigin("*")
public class VNPayController {

    private final VNPayService vnPayService;

    @GetMapping("/create-payment")
    public ResponseEntity<Map<String, String>> createPayment(
            @RequestParam Long appointmentId,
            @RequestParam double amount,
            HttpServletRequest req) throws UnsupportedEncodingException {
        
        String paymentUrl = vnPayService.createPaymentUrl(appointmentId, amount, req);
        return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
    }

    @GetMapping("/callback")
    public RedirectView paymentCallback(@RequestParam Map<String, String> queryParams) throws UnsupportedEncodingException {
        String txnRef = queryParams.get("vnp_TxnRef");
        boolean success = vnPayService.handleCallback(queryParams);
        
        if (success) {
            return new RedirectView("http://localhost:5174/appointments/" + txnRef + "?payment=success");
        } else {
            return new RedirectView("http://localhost:5174/appointments/" + txnRef + "?payment=fail");
        }
    }
}
