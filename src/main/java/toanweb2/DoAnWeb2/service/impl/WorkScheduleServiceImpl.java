package toanweb2.DoAnWeb2.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import toanweb2.DoAnWeb2.entity.WorkSchedule;
import toanweb2.DoAnWeb2.repository.WorkScheduleRepository;
import toanweb2.DoAnWeb2.service.WorkScheduleService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkScheduleServiceImpl implements WorkScheduleService {

    private final WorkScheduleRepository workScheduleRepository;

    @Override
    public List<WorkSchedule> findAll() {
        return workScheduleRepository.findAll();
    }

    @Override
    public Optional<WorkSchedule> findById(Long id) {
        return workScheduleRepository.findById(id);
    }

    @Override
    public List<WorkSchedule> findByEmployeeId(Long employeeId) {
        return workScheduleRepository.findByEmployeeId(employeeId);
    }

    @Override
    public List<WorkSchedule> findByDate(LocalDate date) {
        return workScheduleRepository.findByWorkDate(date);
    }

    @Override
    public List<WorkSchedule> findByEmployeeIdAndDate(Long employeeId, LocalDate date) {
        return workScheduleRepository.findByEmployeeIdAndWorkDate(employeeId, date);
    }

    @Override
    public WorkSchedule save(WorkSchedule workSchedule) {
        return workScheduleRepository.save(workSchedule);
    }

    @Override
    public WorkSchedule update(Long id, WorkSchedule workSchedule) {
        WorkSchedule existing = workScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch làm việc với ID: " + id));
        existing.setEmployee(workSchedule.getEmployee());
        existing.setWorkDate(workSchedule.getWorkDate());
        existing.setStartTime(workSchedule.getStartTime());
        existing.setEndTime(workSchedule.getEndTime());
        existing.setStatus(workSchedule.getStatus());
        return workScheduleRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        workScheduleRepository.deleteById(id);
    }
}
