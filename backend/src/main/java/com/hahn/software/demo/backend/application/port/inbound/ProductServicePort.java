package com.hahn.software.demo.backend.application.port.inbound;

import com.hahn.software.demo.backend.domain.aggregate.Product;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ProductServicePort {
    Product createProduct(Product product, MultipartFile image);
    Product updateProduct(UUID id, Product product, MultipartFile image);
    Product getProductById(UUID id);
    List<Product> getAllProducts();
    void deleteProduct(UUID id);
    String getImageUrl(UUID id);
}

