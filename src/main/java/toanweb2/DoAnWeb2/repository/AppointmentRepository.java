package toanweb2.DoAnWeb2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import toanweb2.DoAnWeb2.entity.Appointment;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCustomerId(Long customerId);
    List<Appointment> findByEmployeeId(Long employeeId);
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByStatus(String status);

    @Query("SELECT a FROM Appointment a WHERE a.employee.id = :employeeId AND a.appointmentDate = :date AND a.status NOT IN ('DA_HUY', 'KHACH_KHONG_DEN')")
    List<Appointment> findByEmployeeIdAndDate(@Param("employeeId") Long employeeId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.room.id = :roomId AND a.appointmentDate = :date AND a.status NOT IN ('DA_HUY', 'KHACH_KHONG_DEN')")
    List<Appointment> findByRoomIdAndDate(@Param("roomId") Long roomId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.services WHERE a.id = :id")
    java.util.Optional<Appointment> findByIdWithServices(@Param("id") Long id);
}
