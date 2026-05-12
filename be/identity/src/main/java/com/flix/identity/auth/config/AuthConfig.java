package com.flix.identity.auth.config;

import com.flix.common.config.CommonConfig;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
@Getter
public class AuthConfig extends CommonConfig {

    @Value("${identity.jwt.secret-key}")
    private String jwtSecret;

    @Value("${identity.jwt.expiration-seconds}")
    private Long jwtExpirationSeconds;

    @Value("${identity.oauth2.redirect-url}")
    private String oauth2RedirectUrl;

}
