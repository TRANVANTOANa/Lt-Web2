package toanweb2.DoAnWeb2.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import toanweb2.DoAnWeb2.entity.Appointment;
import toanweb2.DoAnWeb2.repository.AppointmentRepository;
import toanweb2.DoAnWeb2.service.AppointmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Override
    public List<Appointment> findAll() {
        return appointmentRepository.findAll();
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

    @Override
    public Appointment save(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    @Override
    public Appointment update(Long id, Appointment appointment) {
        Appointment existing = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn với ID: " + id));
        existing.setCustomer(appointment.getCustomer());
        existing.setEmployee(appointment.getEmployee());
        existing.setRoom(appointment.getRoom());
        existing.setAppointmentDate(appointment.getAppointmentDate());
        existing.setAppointmentTime(appointment.getAppointmentTime());
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
            // Tính tổng thời gian dịch vụ của lịch hẹn hiện tại
            int totalDuration = 60; // Mặc định 60 phút nếu không có chi tiết
            if (a.getAppointmentDetails() != null && !a.getAppointmentDetails().isEmpty()) {
                totalDuration = a.getAppointmentDetails().stream()
                        .mapToInt(d -> d.getDuration() != null ? d.getDuration() : 60)
                        .sum();
            }
            LocalTime existingEnd = existingStart.plusMinutes(totalDuration);

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
            int totalDuration = 60;
            if (a.getAppointmentDetails() != null && !a.getAppointmentDetails().isEmpty()) {
                totalDuration = a.getAppointmentDetails().stream()
                        .mapToInt(d -> d.getDuration() != null ? d.getDuration() : 60)
                        .sum();
            }
            LocalTime existingEnd = existingStart.plusMinutes(totalDuration);

            if (time.isBefore(existingEnd) && endTime.isAfter(existingStart)) {
                return true; // Có trùng phòng
            }
        }
        return false;
    }
}
