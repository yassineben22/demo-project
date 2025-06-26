package com.hahn.software.demo.backend.domain.mapper;

import com.hahn.software.demo.backend.domain.aggregate.Product;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request.ProductRequest;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.response.ProductResponse;

import java.util.List;
import java.util.stream.Collectors;

public class ProductDomainMapper {

    public static Product toEntity(ProductRequest request) {
        return Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .category(request.getCategory())
                .build();
    }

    public static ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
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

    public static List<ProductResponse> toResponseList(List<Product> products) {
        return products.stream()
                .map(ProductDomainMapper::toResponse)
                .collect(Collectors.toList());
    }
}
