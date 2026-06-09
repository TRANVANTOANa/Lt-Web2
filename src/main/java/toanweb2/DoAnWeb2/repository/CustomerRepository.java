package toanweb2.DoAnWeb2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import toanweb2.DoAnWeb2.entity.Customer;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByPhone(String phone);
    Optional<Customer> findByEmail(String email);
    List<Customer> findByCustomerType(String customerType);

    @Query("SELECT c FROM Customer c WHERE c.fullName LIKE %:keyword% OR c.phone LIKE %:keyword% OR c.email LIKE %:keyword%")
    List<Customer> searchByKeyword(@Param("keyword") String keyword);
}
