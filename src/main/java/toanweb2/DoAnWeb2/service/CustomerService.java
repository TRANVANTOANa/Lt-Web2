package toanweb2.DoAnWeb2.service;

import toanweb2.DoAnWeb2.entity.Customer;

import java.util.List;
import java.util.Optional;

public interface CustomerService {
    List<Customer> findAll();
    Optional<Customer> findById(Long id);
    List<Customer> searchByKeyword(String keyword);
    List<Customer> findByCustomerType(String customerType);
    Customer save(Customer customer);
    Customer update(Long id, Customer customer);
    void deleteById(Long id);
}
