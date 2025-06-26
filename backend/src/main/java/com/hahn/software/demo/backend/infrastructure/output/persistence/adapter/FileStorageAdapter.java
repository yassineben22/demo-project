package com.hahn.software.demo.backend.infrastructure.output.persistence.adapter;

import com.hahn.software.demo.backend.application.port.outbound.FileStoragePort;
import com.hahn.software.demo.backend.domain.exception.ProductException;
import com.hahn.software.demo.backend.domain.exception.ProductExceptionEnum;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileStorageAdapter implements FileStoragePort {

    @Value("${app.file-storage.upload-dir}")
    private String uploadDir;

    @Value("${app.base-url}")
    private String baseUrl;

    @Override
    public String saveProductImage(UUID productId, MultipartFile file) {
        try {
            // Create the upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir, "products").toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Get the file extension
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));

            // Create a unique filename based on the product ID
            String filename = productId + fileExtension;

            // Save the file
            Path targetLocation = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return the URL to access the image
            return ServletUriComponentsBuilder.fromHttpUrl(baseUrl)
                    .path("/api/products/images/")
                    .path(filename)
                    .toUriString();
        } catch (IOException ex) {
            throw new ProductException(
                    ProductExceptionEnum.PRODUCT_IMAGE_UPLOAD_FAILED.getCode(),
                    "Could not store file for product " + productId + ". Error: " + ex.getMessage());
        }
    }

    @Override
    public void deleteProductImage(UUID productId) {
        try {
            Path uploadPath = Paths.get(uploadDir, "products").toAbsolutePath().normalize();

            // Try to delete files with common image extensions
            String[] extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"};

            for (String ext : extensions) {
                Path filePath = uploadPath.resolve(productId + ext);
                Files.deleteIfExists(filePath);
            }
        } catch (IOException ex) {
            // Log error but don't throw exception as this is not critical
            System.err.println("Could not delete product image for " + productId + ": " + ex.getMessage());
        }
    }

    @Override
    public String getProductImageUrl(UUID productId) {
        try {
            Path uploadPath = Paths.get(uploadDir, "products").toAbsolutePath().normalize();

            // Try to find file with common image extensions
            String[] extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"};

            for (String ext : extensions) {
                Path filePath = uploadPath.resolve(productId + ext);
                if (Files.exists(filePath)) {
                    String filename = productId + ext;
                    return ServletUriComponentsBuilder.fromHttpUrl(baseUrl)
                            .path("/api/products/images/")
                            .path(filename)
                            .toUriString();
                }
            }

            throw new ProductException(
                    ProductExceptionEnum.PRODUCT_IMAGE_NOT_FOUND.getCode(),
                    "Image not found for product " + productId);
        } catch (Exception ex) {
            if (ex instanceof ProductException) {
                throw ex;
            }
            throw new ProductException(
                    ProductExceptionEnum.PRODUCT_IMAGE_NOT_FOUND.getCode(),
                    "Could not retrieve image URL for product " + productId + ": " + ex.getMessage());
        }
    }
}
