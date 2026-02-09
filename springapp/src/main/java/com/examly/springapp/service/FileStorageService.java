package com.examly.springapp.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    
    private final Path rootLocation = Paths.get("uploads");
    
    public FileStorageService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory");
        }
    }
    
    public String storeFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file");
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.contains(".") ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String newFilename = UUID.randomUUID().toString() + fileExtension;
            
            // Copy file to target location
            Path destinationFile = this.rootLocation.resolve(
                Paths.get(newFilename))
                .normalize().toAbsolutePath();
            
            Files.copy(file.getInputStream(), destinationFile);
            
            return newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
    
    public boolean deleteFile(String filename) {
        try {
            Path filePath = this.rootLocation.resolve(filename).normalize().toAbsolutePath();
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }
    
    public Path loadFile(String filename) {
        return rootLocation.resolve(filename);
    }
}