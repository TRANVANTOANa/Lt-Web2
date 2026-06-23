package toanweb2.DoAnWeb2.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import toanweb2.DoAnWeb2.entity.WorkSchedule;
import toanweb2.DoAnWeb2.service.WorkScheduleService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/work-schedules")
@RequiredArgsConstructor
@CrossOrigin("*")
public class WorkScheduleController {

    private final WorkScheduleService workScheduleService;

    @GetMapping
    public ResponseEntity<List<WorkSchedule>> getAllWorkSchedules() {
        return ResponseEntity.ok(workScheduleService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkSchedule> getWorkScheduleById(@PathVariable Long id) {
        return workScheduleService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<WorkSchedule>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(workScheduleService.findByEmployeeId(employeeId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<WorkSchedule>> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(workScheduleService.findByDate(date));
    }

    @GetMapping("/employee/{employeeId}/date/{date}")
    public ResponseEntity<List<WorkSchedule>> getByEmployeeAndDate(
            @PathVariable Long employeeId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(workScheduleService.findByEmployeeIdAndDate(employeeId, date));
    }

    @PostMapping
    public ResponseEntity<WorkSchedule> createWorkSchedule(@RequestBody WorkSchedule workSchedule) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workScheduleService.save(workSchedule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkSchedule> updateWorkSchedule(@PathVariable Long id, @RequestBody WorkSchedule workSchedule) {
        return ResponseEntity.ok(workScheduleService.update(id, workSchedule));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkSchedule(@PathVariable Long id) {
        workScheduleService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
