package toanweb2.DoAnWeb2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import toanweb2.DoAnWeb2.entity.WorkSchedule;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, Long> {
    List<WorkSchedule> findByEmployeeId(Long employeeId);
    List<WorkSchedule> findByWorkDate(LocalDate workDate);
    List<WorkSchedule> findByEmployeeIdAndWorkDate(Long employeeId, LocalDate workDate);
}
