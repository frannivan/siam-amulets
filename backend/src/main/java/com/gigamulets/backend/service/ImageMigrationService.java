package com.gigamulets.backend.service;

import com.gigamulets.backend.model.Product;
import com.gigamulets.backend.model.ProductImage;
import com.gigamulets.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.io.InputStream;
import java.net.URL;
import java.util.List;

@Service
public class ImageMigrationService {

    private final ProductRepository productRepository;

    public ImageMigrationService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional
    public void downloadAndPersistImages() {
        System.out.println("Checking for images to download for DB storage...");
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            // Accessing images here requires an active session (which @Transactional
            // provides)
            for (ProductImage image : product.getImages()) {
                if (image.getImageUrl() != null
                        && (image.getImageUrl().startsWith("http") || image.getImageUrl().startsWith("seed"))
                        && !image.getImageUrl().contains("localhost")) {
                    try {
                        System.out.println(
                                "Downloading image for: " + product.getName() + " from " + image.getImageUrl());
                        URL url;
                        if (image.getImageUrl().startsWith("seed:")) {
                            String filename = image.getImageUrl().substring(5);
                            System.out.println("Loading seed image: " + filename);
                            url = getClass().getClassLoader().getResource("seed-images/" + filename);
                            if (url == null) {
                                throw new RuntimeException("Seed image not found: " + filename);
                            }
                            try (InputStream in = url.openStream()) {
                                byte[] imageBytes = in.readAllBytes();
                                image.setContent(imageBytes);
                                if (filename.endsWith(".png")) {
                                    image.setContentType("image/png");
                                } else {
                                    image.setContentType("image/jpeg");
                                }
                                // Update URL to point to the controller
                                image.setImageUrl("/api/catalog/images/" + image.getId());
                            }
                        } else {
                            url = new URL(image.getImageUrl());
                            java.net.HttpURLConnection connection = (java.net.HttpURLConnection) url.openConnection();
                            connection.setRequestProperty("User-Agent",
                                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");

                            try (InputStream in = connection.getInputStream()) {
                                byte[] imageBytes = in.readAllBytes();
                                image.setContent(imageBytes);
                                image.setContentType("image/jpeg"); // Assume JPEG for Unsplash/Placeholders
                            }
                        }
                    } catch (Exception e) {
                        System.err.println("Failed to download image for " + product.getName() + ": " + e.getMessage());
                    }
                }
            }
            productRepository.save(product);
        }
        System.out.println("Image download and DB persistence complete.");
    }
}
