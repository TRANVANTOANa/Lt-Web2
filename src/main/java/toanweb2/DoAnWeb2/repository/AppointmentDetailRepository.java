package toanweb2.DoAnWeb2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import toanweb2.DoAnWeb2.entity.AppointmentDetail;

import java.util.List;

@Repository
public interface AppointmentDetailRepository extends JpaRepository<AppointmentDetail, Long> {
    List<AppointmentDetail> findByAppointmentId(Long appointmentId);
}
