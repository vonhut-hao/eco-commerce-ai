package com.flix.common.api;

import com.flix.common.file.s3.S3Wrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class FileUploaderController {
    private final S3Wrapper s3Wrapper;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file) throws IOException {

        String key = "file/" + UUID.randomUUID() + ".jpg";

        String url = s3Wrapper.uploadPublic(key, file);

        return ResponseEntity.ok(Map.of("url", url));
    }
}
