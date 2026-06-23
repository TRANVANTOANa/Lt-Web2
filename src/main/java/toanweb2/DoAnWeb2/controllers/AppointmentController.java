package toanweb2.DoAnWeb2.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import toanweb2.DoAnWeb2.entity.Appointment;
import toanweb2.DoAnWeb2.service.AppointmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Appointment>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(appointmentService.findByCustomerId(customerId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Appointment>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(appointmentService.findByEmployeeId(employeeId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Appointment>> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.findByDate(date));
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.save(appointment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.update(id, appointment));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, request.status()));
    }

    @GetMapping("/check-employee-conflict")
    public ResponseEntity<Map<String, Boolean>> checkEmployeeConflict(
            @RequestParam Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time,
            @RequestParam Integer duration) {
        boolean conflict = appointmentService.checkEmployeeConflict(employeeId, date, time, duration);
        return ResponseEntity.ok(Map.of("conflict", conflict));
    }

    @GetMapping("/check-room-conflict")
    public ResponseEntity<Map<String, Boolean>> checkRoomConflict(
            @RequestParam Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time,
            @RequestParam Integer duration) {
        boolean conflict = appointmentService.checkRoomConflict(roomId, date, time, duration);
        return ResponseEntity.ok(Map.of("conflict", conflict));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public record StatusRequest(String status) {
    }
}
