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
        if (appointment.getAppointmentDetails() != null && !appointment.getAppointmentDetails().isEmpty()) {
            java.util.Map<String, Object> detail = appointment.getAppointmentDetails().get(0);
            if (appointment.getService() == null && detail.get("service") instanceof java.util.Map) {
                java.util.Map<?, ?> svcMap = (java.util.Map<?, ?>) detail.get("service");
                Object svcIdObj = svcMap.get("id");
                if (svcIdObj != null) {
                    Long svcId = Long.valueOf(svcIdObj.toString());
                    toanweb2.DoAnWeb2.entity.SpaService svc = new toanweb2.DoAnWeb2.entity.SpaService();
                    svc.setId(svcId);
                    appointment.setService(svc);
                }
            }
            if (appointment.getPrice() == null && detail.get("price") != null) {
                appointment.setPrice(new java.math.BigDecimal(detail.get("price").toString()));
            }
            if (appointment.getDuration() == null && detail.get("duration") != null) {
                appointment.setDuration(Integer.valueOf(detail.get("duration").toString()));
            }
        }
    }

    @Override
    public Appointment save(Appointment appointment) {
        mapDetailsToAppointment(appointment);
        return appointmentRepository.save(appointment);
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
