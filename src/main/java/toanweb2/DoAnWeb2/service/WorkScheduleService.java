package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.WorkSchedule;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WorkScheduleService {
    List<WorkSchedule> findAll();
    Optional<WorkSchedule> findById(Long id);
    List<WorkSchedule> findByEmployeeId(Long employeeId);
    List<WorkSchedule> findByDate(LocalDate date);
    List<WorkSchedule> findByEmployeeIdAndDate(Long employeeId, LocalDate date);
    WorkSchedule save(WorkSchedule workSchedule);
    WorkSchedule update(Long id, WorkSchedule workSchedule);
    void deleteById(Long id);
}
