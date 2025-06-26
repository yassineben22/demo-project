package com.hahn.software.demo.backend.infrastructure.inbound.rest.controller;

import com.hahn.software.demo.backend.application.port.inbound.ProductServicePort;
import com.hahn.software.demo.backend.domain.aggregate.Product;
import com.hahn.software.demo.backend.domain.mapper.ProductDomainMapper;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request.CustomRequestBody;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request.PaginationRequest;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request.ProductRequest;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.response.PagedResponse;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.response.ProductResponse;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.response.ResponseBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductServicePort productService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseBody<ProductResponse, ReferenceData>> createProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam("category") String category,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        // Create ProductRequest from form fields
        ProductRequest productRequest = ProductRequest.builder()
                .name(name)
                .description(description)
                .price(price)
                .stockQuantity(stockQuantity)
                .category(category)
                .build();

        Product product = ProductDomainMapper.toEntity(productRequest);
        Product createdProduct = productService.createProduct(product, image);

        ResponseBody<ProductResponse, ReferenceData> responseBody =
                new ResponseBody<>(
                        "000",
                        "Product created successfully",
                        ProductDomainMapper.toResponse(createdProduct),
                        null
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
    }

    @PostMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseBody<ProductResponse, ReferenceData>> updateProduct(
            @PathVariable UUID id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam("category") String category,
            @RequestParam("deviceId") String deviceId,
            @RequestParam("lang") String lang,
            @RequestParam("channel") String channel,
            @RequestParam(value = "timestamp", required = false) String timestamp,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        // Create ProductRequest from form fields
        ProductRequest productRequest = ProductRequest.builder()
                .name(name)
                .description(description)
                .price(price)
                .stockQuantity(stockQuantity)
                .category(category)
                .build();

        // Create ReferenceData from form fields
        ReferenceData referenceData = ReferenceData.builder()
                .deviceId(deviceId)
                .lang(lang)
                .build();

        Product product = ProductDomainMapper.toEntity(productRequest);
        Product updatedProduct = productService.updateProduct(id, product, image);

        ResponseBody<ProductResponse, ReferenceData> responseBody =
                new ResponseBody<>(
                        "000",
                        "Product updated successfully",
                        ProductDomainMapper.toResponse(updatedProduct),
                        referenceData
                );

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/get/{id}")
    public ResponseEntity<ResponseBody<ProductResponse, ReferenceData>> getProductById(
            @PathVariable UUID id,
            @Valid @RequestBody CustomRequestBody<Object, ReferenceData> requestBody) {

        ReferenceData referenceData = requestBody.getReferenceData();
        Product product = productService.getProductById(id);

        ResponseBody<ProductResponse, ReferenceData> responseBody =
                new ResponseBody<>(
                        "000",
                        "Product retrieved successfully",
                        ProductDomainMapper.toResponse(product),
                        referenceData
                );

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/get/all")
    public ResponseEntity<ResponseBody<List<ProductResponse>, ReferenceData>> getAllProducts(
            @Valid @RequestBody CustomRequestBody<Object, ReferenceData> requestBody) {

        ReferenceData referenceData = requestBody.getReferenceData();
        List<Product> products = productService.getAllProducts();

        ResponseBody<List<ProductResponse>, ReferenceData> responseBody =
                new ResponseBody<>(
                        "000",
                        "Products retrieved successfully",
                        ProductDomainMapper.toResponseList(products),
                        referenceData
                );

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<ResponseBody<Void, ReferenceData>> deleteProduct(
            @PathVariable UUID id,
            @Valid @RequestBody CustomRequestBody<Object, ReferenceData> requestBody) {

        ReferenceData referenceData = requestBody.getReferenceData();
        productService.deleteProduct(id);

        ResponseBody<Void, ReferenceData> responseBody =
                new ResponseBody<>(
                        "000",
                        "Product deleted successfully",
                        null,
                        referenceData
                );

        return ResponseEntity.ok(responseBody);
}
    }
}
