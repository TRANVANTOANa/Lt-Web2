package toanweb2.DoAnWeb2;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import toanweb2.DoAnWeb2.repository.UserRepository;
import toanweb2.DoAnWeb2.repository.CustomerRepository;
import toanweb2.DoAnWeb2.repository.InvoiceRepository;

@SpringBootTest
class DoAnWeb2ApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Test
    void inspectDb() {
        System.out.println("=== DB INSPECTION START ===");
        
        System.out.println("\n=== USERS ===");
        userRepository.findAll().forEach(u -> {
            System.out.printf("ID: %d | Username: %s | FullName: %s | Phone: %s | Email: %s%n",
                    u.getId(), u.getUsername(), u.getFullName(), u.getPhone(), u.getEmail());
        });

        System.out.println("\n=== CUSTOMERS ===");
        customerRepository.findAll().forEach(c -> {
            System.out.printf("ID: %d | FullName: %s | Phone: %s | Email: %s%n",
                    c.getId(), c.getFullName(), c.getPhone(), c.getEmail());
        });

        System.out.println("\n=== INVOICES ===");
        invoiceRepository.findAll().forEach(i -> {
            System.out.printf("ID: %d | CustomerID: %s | Total: %s | Status: %s%n",
                    i.getId(), i.getCustomer() != null ? i.getCustomer().getId() : "null", i.getTotalAmount(), i.getPaymentStatus());
        });

        System.out.println("\n=== DB INSPECTION END ===");
    }
}
