package com.flix.common.file.s3;

import com.flix.common.config.CommonConfig;
import io.awspring.cloud.s3.S3Resource;
import io.awspring.cloud.s3.S3Template;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;

@RequiredArgsConstructor
@Service
@Slf4j
public class S3Wrapper {
    private final S3Template s3Template;
    CommonConfig config;

    public String uploadPublic(String key, MultipartFile file) throws IOException {
        log.info("Uploading public file with key: {}", key);
        var uploaded = s3Template.upload(config.getBucketName(), key, file.getInputStream());
        String publicURL = uploaded.getURL().toString();
        log.debug("Public URL: {}", publicURL);
        return publicURL;
    }

    public String uploadPrivate(String key, MultipartFile file) throws IOException {
        log.info("Uploading private file with key: {}", key);
        s3Template.upload(config.getBucketName(), key, file.getInputStream());
        log.info("File uploaded to S3 with key: {}", key);
        return key;
    }

    public String getPresignedUrl(String key, Duration expiry) {
        log.info("Getting presigned URL with key: {}", key);
        String presignedURL = s3Template.createSignedGetURL(config.getBucketName(), key, expiry).toString();
        log.debug("Presigned URL: {}", presignedURL);
        return presignedURL;
    }

    public byte[] download(String key) throws IOException {
        log.info("Downloading file from S3 with key: {}", key);
        S3Resource resource = s3Template.download(config.getBucketName(), key);
        return resource.getInputStream().readAllBytes();
    }

    public void delete(String key) {
        log.info("Deleting file from S3 with key: {}", key);
        s3Template.deleteObject(config.getBucketName(), key);
    }

}
