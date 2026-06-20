package com.flix.common.config;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;

@Getter
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommonConfig {

    @Value("${local.server.port}")
    String serverPort;

    @Value("${aws.s3.bucket.name:ecosystemctu}")
    String bucketName;
}
