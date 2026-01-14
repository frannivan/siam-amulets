package com.gigamulets.backend.config;

import com.gigamulets.backend.service.ImageMigrationService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(ImageMigrationService imageMigrationService) {
        return args -> {
            imageMigrationService.downloadAndPersistImages();
        };
    }
}
