package com.hahn.software.demo.backend.domain.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ProductExceptionEnum {
    PRODUCT_NOT_FOUND("PRD-001", "Product not found"),
    INVALID_PRODUCT_DATA("PRD-002", "Invalid product data"),
    PRODUCT_IMAGE_UPLOAD_FAILED("PRD-003", "Failed to upload product image"),
    PRODUCT_IMAGE_NOT_FOUND("PRD-004", "Product image not found");

    private final String code;
    private final String message;
}
