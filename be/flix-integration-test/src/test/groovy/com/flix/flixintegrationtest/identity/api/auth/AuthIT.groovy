package com.flix.flixintegrationtest.identity.api.auth

import com.flix.common.enums.Role
import com.flix.flixintegrationtest.common.BaseITSpec
import com.flix.flixintegrationtest.identity.config.BaseIT
import io.restassured.RestAssured
import org.springframework.http.HttpStatus

class AuthIT extends BaseITSpec {

    //Login Tests

    def "should login successfully with valid credentials"() {
        given:
        createAdminUser()

        when:
        def response = RestAssured.given()
                .body([username: "admin@flix.com", password: "Admin@123"])
                .post(BaseIT.LOGIN_API)

        then:
        response.statusCode() == 200
        response.body().jsonPath().getString("data.accessToken") != null
    }

    def "should fail login with invalid credentials"() {
        when:
        def response = RestAssured.given()
                .body([username: "asdasd", password: "asdasd"])
                .post(BaseIT.LOGIN_API)
        then:
        response.statusCode() == 401
        response.body().jsonPath().getString("detail").equalsIgnoreCase("Invalid username or password")

    }

    //Register Tests

    def "should register successfully with valid data"() {
        given:
        def userData = [username: "test", email: "test@gmail.com", password: "Test@123"]

        when:
        def response = RestAssured.given()
                .body(userData)
                .post(api)

        then:
        def userSaved = userRepository.findByEmail(userData.email).get()

        response.statusCode() == HttpStatus.CREATED.value()
        response.body().jsonPath().getString("data.accessToken") != null
        userSaved.username == userData.username
        userSaved.email == userData.email
        userSaved.password != userData.password
        userSaved.isEnabled == true
        userSaved.isVerified == true
        userSaved.roles.containsAll(expectedRoles)

        where:
        api                        | expectedRoles
        BaseIT.REGISTER_NORMAL_API | [Role.USER]
        BaseIT.REGISTER_VIP_API    | [Role.USER, Role.VIP]
    }

    def "should fail register with invalid data"() {
        when:
        def responseNormalUser = RestAssured.given()
                .body(userDatas)
                .post(BaseIT.REGISTER_NORMAL_API)
        def responseVipUser = RestAssured.given()
                .body(userDatas)
                .post(BaseIT.REGISTER_VIP_API)

        then:
        responseNormalUser.statusCode() == HttpStatus.BAD_REQUEST.value()
        responseVipUser.statusCode() == HttpStatus.BAD_REQUEST.value()

        where:
        scenario               | userDatas
        "invalid email format" | [username: "test", email: "asdasd", password: "asdasd"]
        "weak password"        | [username: "test", email: "asdasda@gmail.com", password: "123"]
        "missing username"     | [username: "", email: "asdasda@gmail.com", password: "123"]
        "missing email"        | [username: "test", email: "", password: "123"]
        "missing password"     | [username: "test", email: "asdasda@gmail.com", password: ""]
    }


}