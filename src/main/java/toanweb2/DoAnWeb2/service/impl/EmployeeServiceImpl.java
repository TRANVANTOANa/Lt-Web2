package toanweb2.DoAnWeb2.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import toanweb2.DoAnWeb2.entity.Employee;
import toanweb2.DoAnWeb2.repository.EmployeeRepository;
import toanweb2.DoAnWeb2.service.EmployeeService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    @Override
    public Optional<Employee> findById(Long id) {
        return employeeRepository.findById(id);
    }

    @Override
    public List<Employee> findByPosition(String position) {
        return employeeRepository.findByPosition(position);
    }

    @Override
    public List<Employee> findByStatus(String status) {
        return employeeRepository.findByStatus(status);
    }

    @Override
    public List<Employee> searchByFullName(String fullName) {
        return employeeRepository.findByFullNameContainingIgnoreCase(fullName);
    }

    @Override
    public Employee save(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public Employee update(Long id, Employee employee) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));
        existing.setFullName(employee.getFullName());
        existing.setPhone(employee.getPhone());
        existing.setEmail(employee.getEmail());
        existing.setGender(employee.getGender());
        existing.setPosition(employee.getPosition());
        existing.setSalary(employee.getSalary());
        existing.setStatus(employee.getStatus());
        return employeeRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        employeeRepository.deleteById(id);
    }
}
