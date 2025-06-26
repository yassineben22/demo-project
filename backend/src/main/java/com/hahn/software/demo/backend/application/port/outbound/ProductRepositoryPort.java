package com.hahn.software.demo.backend.application.port.outbound;

import com.hahn.software.demo.backend.domain.aggregate.Product;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepositoryPort {
    Product save(Product product);
    Optional<Product> findById(UUID id);
    List<Product> findAll();
    void deleteById(UUID id);
    boolean existsById(UUID id);
}

