package toanweb2.DoAnWeb2.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import toanweb2.DoAnWeb2.entity.Customer;
import toanweb2.DoAnWeb2.repository.CustomerRepository;
import toanweb2.DoAnWeb2.service.CustomerService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    @Override
    public Optional<Customer> findById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public List<Customer> searchByKeyword(String keyword) {
        return customerRepository.searchByKeyword(keyword);
    }

    @Override
    public List<Customer> findByCustomerType(String customerType) {
        return customerRepository.findByCustomerType(customerType);
    }

    @Override
    public Customer save(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Customer update(Long id, Customer customer) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + id));
        existing.setFullName(customer.getFullName());
        existing.setPhone(customer.getPhone());
        existing.setEmail(customer.getEmail());
        existing.setGender(customer.getGender());
        existing.setBirthday(customer.getBirthday());
        existing.setAddress(customer.getAddress());
        existing.setCustomerType(customer.getCustomerType());
        existing.setNote(customer.getNote());
        return customerRepository.save(existing);
    }

    @Override
    public void deleteById(Long id) {
        customerRepository.deleteById(id);
    }
}
