package com.flix.flixintegrationtest.common

import com.flix.app.FlixPlaftformApplication
import com.flix.common.enums.Role
import com.flix.identity.entity.User
import com.flix.identity.dao.UserRepository
import io.restassured.RestAssured
import io.restassured.builder.RequestSpecBuilder
import io.restassured.http.ContentType
import lombok.extern.slf4j.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.context.annotation.Import
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification

@SpringBootTest(
        classes = FlixPlaftformApplication,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@Import(TestcontainersConfiguration.class)
@ActiveProfiles("test")
abstract class BaseITSpec extends Specification {

    @LocalServerPort
    int port;

    @Autowired
    JdbcTemplate jdbc;

    @Autowired
    UserRepository userRepository;

    def setup() {
        RestAssured.port = port
        RestAssured.baseURI = "http://localhost"
        RestAssured.basePath = "/v1"
        RestAssured.requestSpecification = new RequestSpecBuilder()
                .setContentType(ContentType.JSON)
                .build()
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
        def resp = RestAssured.given()
                .basePath("/v1")
                .body([username: username, password: password])
                .post("/auth/login").body().jsonPath()
        resp.getString("data.accessToken")
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
        userRepository.save(user)
    }

    protected String getAdminToken() {
        loginAndGetToken("admin", "Admin@123")
    }

    protected String getNormalUserToken() {
        loginAndGetToken("testNormalUser", "Admin@123")
    }
}
