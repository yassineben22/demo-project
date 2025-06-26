package com.hahn.software.demo.backend.infrastructure.output.persistence.adapter;

import com.hahn.software.demo.backend.application.port.outbound.ProductRepositoryPort;
import com.hahn.software.demo.backend.domain.aggregate.Product;
import com.hahn.software.demo.backend.infrastructure.output.persistence.entity.ProductEntity;
import com.hahn.software.demo.backend.infrastructure.output.persistence.mapper.ProductPersistenceMapper;
import com.hahn.software.demo.backend.infrastructure.output.persistence.repository.ProductJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ProductRepositoryAdapter implements ProductRepositoryPort {

    private final ProductJpaRepository productJpaRepository;

    @Override
    public Product save(Product product) {
        ProductEntity entity = ProductPersistenceMapper.toEntity(product);
        ProductEntity savedEntity = productJpaRepository.save(entity);
        return ProductPersistenceMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Product> findById(UUID id) {
        return productJpaRepository.findById(id)
                .map(ProductPersistenceMapper::toDomain);
    }

    @Override
    public List<Product> findAll() {
        List<ProductEntity> entities = productJpaRepository.findAll();
        return ProductPersistenceMapper.toDomainList(entities);
    }

    @Override
    public void deleteById(UUID id) {
        productJpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID id) {
        return productJpaRepository.existsById(id);
    }
}

