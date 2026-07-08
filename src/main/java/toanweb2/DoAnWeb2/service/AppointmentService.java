package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentService {
    List<Appointment> findAll();
    Optional<Appointment> findById(Long id);
    List<Appointment> findByCustomerId(Long customerId);
    List<Appointment> findByEmployeeId(Long employeeId);
    List<Appointment> findByDate(LocalDate date);
    Appointment save(Appointment appointment);
    Appointment update(Long id, Appointment appointment);
    void deleteById(Long id);
    Appointment updateStatus(Long id, String status);
    boolean checkEmployeeConflict(Long employeeId, LocalDate date, LocalTime time, Integer duration);
    boolean checkRoomConflict(Long roomId, LocalDate date, LocalTime time, Integer duration);
}
