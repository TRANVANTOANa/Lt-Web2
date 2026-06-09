package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.Employee;

import java.util.List;
import java.util.Optional;

public interface EmployeeService {
    List<Employee> findAll();
    Optional<Employee> findById(Long id);
    List<Employee> findByPosition(String position);
    List<Employee> findByStatus(String status);
    List<Employee> searchByFullName(String fullName);
    Employee save(Employee employee);
    Employee update(Long id, Employee employee);
    void deleteById(Long id);
}
