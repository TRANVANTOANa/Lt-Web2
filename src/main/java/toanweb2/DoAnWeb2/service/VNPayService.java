package toanweb2.DoAnWeb2.service;

import jakarta.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.Map;

public interface VNPayService {
    String createPaymentUrl(Long appointmentId, double amount, HttpServletRequest request) throws UnsupportedEncodingException;
    boolean handleCallback(Map<String, String> queryParams) throws UnsupportedEncodingException;
}
