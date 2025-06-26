package com.hahn.software.demo.backend.application.port.outbound;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface FileStoragePort {
    String saveProductImage(UUID productId, MultipartFile file);
    void deleteProductImage(UUID productId);
    String getProductImageUrl(UUID productId);
}
