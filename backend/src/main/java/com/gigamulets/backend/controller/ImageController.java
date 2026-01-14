package com.gigamulets.backend.controller;

import com.gigamulets.backend.model.ProductImage;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/catalog/images")
@CrossOrigin(origins = "*")
public class ImageController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        ProductImage image = entityManager.find(ProductImage.class, id);
        if (image == null || image.getContent() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType
                        .parseMediaType(image.getContentType() != null ? image.getContentType() : "image/jpeg"))
                .body(image.getContent());
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            ProductImage image = new ProductImage();
            image.setContent(file.getBytes());
            image.setContentType(file.getContentType());
            image.setThumbnail(true); // Default
            
            entityManager.persist(image);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", "http://localhost:8081/api/catalog/images/" + image.getId());
            response.put("id", image.getId().toString());
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Fail to upload");
        }
    }
}
