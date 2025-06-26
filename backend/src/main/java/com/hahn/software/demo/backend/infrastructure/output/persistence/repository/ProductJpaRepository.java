package com.hahn.software.demo.backend.infrastructure.output.persistence.repository;

import com.hahn.software.demo.backend.infrastructure.output.persistence.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductJpaRepository extends JpaRepository<ProductEntity, UUID> {
}
