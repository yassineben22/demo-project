package com.hahn.software.demo.backend.infrastructure.output.persistence.mapper;

import com.hahn.software.demo.backend.domain.aggregate.Product;
import com.hahn.software.demo.backend.infrastructure.output.persistence.entity.ProductEntity;

import java.util.List;
import java.util.stream.Collectors;

public class ProductPersistenceMapper {

    public static ProductEntity toEntity(Product product) {
        return ProductEntity.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public static Product toDomain(ProductEntity entity) {
        return Product.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .stockQuantity(entity.getStockQuantity())
                .category(entity.getCategory())
                .imageUrl(entity.getImageUrl())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static List<Product> toDomainList(List<ProductEntity> entities) {
        return entities.stream()
                .map(ProductPersistenceMapper::toDomain)
                .collect(Collectors.toList());
    }
}
