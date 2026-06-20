package com.flix.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(scanBasePackages = "com.flix")
@EntityScan(basePackages = "com.flix")
@EnableJpaRepositories(basePackages = "com.flix")
@EnableJpaAuditing
@EnableAsync
public class FlixPlaftformApplication {

    static void main(String[] args) {
        SpringApplication.run(FlixPlaftformApplication.class, args);
    }

}
