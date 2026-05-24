package com.flix.flixintegrationtest.common

import com.flix.app.FlixPlaftformApplication
import com.flix.common.dto.ApiResponse
import com.flix.common.enums.Role
import com.flix.identity.common.enums.AuthProvider
import com.flix.identity.dao.UserRepository
import com.flix.identity.entity.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.context.annotation.Import
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.client.RestTestClient
import spock.lang.Specification

@SpringBootTest(
        classes = FlixPlaftformApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@Import(TestcontainersConfiguration.class)
@ActiveProfiles("test")
@AutoConfigureRestTestClient
abstract class BaseITSpec extends Specification {

    @LocalServerPort
    int port

    @Autowired
    JdbcTemplate jdbc;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RestTestClient client;

    protected String BASE_API;

    void setup() {
        BASE_API = "http://localhost:${port}/v1"
    }

    protected getApiResponse(String endpoint, String token) {
        if (token != null) {
            return client.get()
                    .uri(BASE_API + endpoint)
                    .header("Authorization", "Bearer ${token}")
                    .exchange()
        } else {
            return client.get()
                    .uri(BASE_API + endpoint)
                    .exchange()
        }
    }

    protected postRequest(String endpoint, Map body, String token = null) {
        if (token != null) {
            return client.post()
                    .uri(BASE_API + endpoint)
                    .header("Authorization", "Bearer ${token}")
                    .body(body)
                    .exchange()
        } else {
            return client.post()
                    .uri(BASE_API + endpoint)
                    .body(body)
                    .exchange()
        }
    }

    protected putRequest(String endpoint, Map body, String token = null) {
        if (token != null) {
            return client.put()
                    .uri(BASE_API + endpoint)
                    .header("Authorization", "Bearer ${token}")
                    .body(body)
                    .exchange()
        } else {
            return client.put()
                    .uri(BASE_API + endpoint)
                    .body(body)
                    .exchange()
        }
    }

    protected deleteRequest(String endpoint, String token = null) {
        if (token != null) {
            return client.delete()
                    .uri(BASE_API + endpoint)
                    .header("Authorization", "Bearer ${token}")
                    .exchange()
        } else {
            return client.delete()
                    .uri(BASE_API + endpoint)
                    .exchange()
        }
    }

    protected patchRequest(String endpoint, Map body, String token = null) {
        if (token != null) {
            return client.patch()
                    .uri(BASE_API + endpoint)
                    .header("Authorization", "Bearer ${token}")
                    .body(body)
                    .exchange()
        } else {
            return client.patch()
                    .uri(BASE_API + endpoint)
                    .body(body)
                    .exchange()
        }
    }


    def cleanup() {
        def tables = jdbc.queryForList("""
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name != 'flyway_schema_history'
        """, String)

        jdbc.execute("SET FOREIGN_KEY_CHECKS = 0")
        tables.each { jdbc.execute("TRUNCATE TABLE ${it}") }
        jdbc.execute("SET FOREIGN_KEY_CHECKS = 1")
    }

    protected String loginAndGetToken(String username, String password) {
        def resp = postRequest("/auth/login", [username: username, password: password])
                .returnResult(ApiResponse)
        def data = resp.responseBody?.data as Map
        data?.accessToken
    }

    protected User createAdminUser() {
        def passwordEncode = '$2a$12$pmIXxQ7H.iNsd6BrXRbC/..DoMMuuFEfKml33imgyOuZklipEtpZ.'
        def user = new User(
                username: "admin",
                email: "admin@flix.com",
                password: passwordEncode,
                isEnabled: true,
                isVerified: true,
        )
        user.roles.add(Role.ADMIN)
        user.authProviders.add(AuthProvider.LOCAL)
        userRepository.save(user)
    }


    protected User createNormalUser() {
        def passwordEncode = '$2a$12$pmIXxQ7H.iNsd6BrXRbC/..DoMMuuFEfKml33imgyOuZklipEtpZ.'
        def user = new User(
                username: "testNormalUser",
                email: "testNormalUser@gmail.com",
                password: passwordEncode,
                isEnabled: true,
                isVerified: true,
        )
        user.roles.add(Role.USER)
        user.authProviders.add(AuthProvider.LOCAL)
        userRepository.save(user)
    }

    protected String getAdminToken() {
        return loginAndGetToken("admin", "Admin@123")
    }

    protected String getNormalUserToken() {
        return loginAndGetToken("testNormalUser", "Admin@123")
    }


}
