package com.hahn.software.demo.backend.domain.service;

import com.hahn.software.demo.backend.application.port.inbound.ProductServicePort;
import com.hahn.software.demo.backend.application.port.outbound.FileStoragePort;
import com.hahn.software.demo.backend.application.port.outbound.ProductRepositoryPort;
import com.hahn.software.demo.backend.domain.aggregate.Product;
import com.hahn.software.demo.backend.domain.exception.ProductException;
import com.hahn.software.demo.backend.domain.exception.ProductExceptionEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService implements ProductServicePort {

    private final ProductRepositoryPort productRepository;
    private final FileStoragePort fileStorage;

    @Override
    @Transactional
    public Product createProduct(Product product, MultipartFile image) {
        // Set new product details
        product.setId(UUID.randomUUID());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        // Save product first to get the ID
        Product savedProduct = productRepository.save(product);

        // If image is provided, upload it and update the product with image URL
        if (image != null && !image.isEmpty()) {
            try {
                String imageUrl = fileStorage.saveProductImage(savedProduct.getId(), image);
                savedProduct.setImageUrl(imageUrl);
                savedProduct = productRepository.save(savedProduct);
            } catch (Exception e) {
                throw new ProductException(ProductExceptionEnum.PRODUCT_IMAGE_UPLOAD_FAILED.getCode(),
                        "Failed to upload image: " + e.getMessage());
            }
        }

        return savedProduct;
    }

    @Override
    @Transactional
    public Product updateProduct(UUID id, Product product, MultipartFile image) {
        // Check if product exists
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ProductException(
                        ProductExceptionEnum.PRODUCT_NOT_FOUND.getCode(),
                        "Product with ID " + id + " not found"));

        // Update product details
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStockQuantity(product.getStockQuantity());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setUpdatedAt(LocalDateTime.now());

        // If image is provided, update it
        if (image != null && !image.isEmpty()) {
            try {
                String imageUrl = fileStorage.saveProductImage(id, image);
                existingProduct.setImageUrl(imageUrl);
            } catch (Exception e) {
                throw new ProductException(ProductExceptionEnum.PRODUCT_IMAGE_UPLOAD_FAILED.getCode(),
                        "Failed to upload image: " + e.getMessage());
            }
        }

        return productRepository.save(existingProduct);
    }

    @Override
    public Product getProductById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductException(
                        ProductExceptionEnum.PRODUCT_NOT_FOUND.getCode(),
                        "Product with ID " + id + " not found"));
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ProductException(
                    ProductExceptionEnum.PRODUCT_NOT_FOUND.getCode(),
                    "Product with ID " + id + " not found");
        }

        // Delete product image if exists
        fileStorage.deleteProductImage(id);

        // Delete product
        productRepository.deleteById(id);
    }

    @Override
    public String getImageUrl(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ProductException(
                    ProductExceptionEnum.PRODUCT_NOT_FOUND.getCode(),
                    "Product with ID " + id + " not found");
        }

        return fileStorage.getProductImageUrl(id);
    }
}

