package com.flix.flixintegrationtest.identity.api.auth

import com.flix.common.dto.ApiResponse
import com.flix.common.enums.Role
import com.flix.flixintegrationtest.common.BaseITSpec
import com.flix.flixintegrationtest.identity.config.BaseIT
import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail

class AuthIT extends BaseITSpec {

    //Login Tests

    def "should login successfully with valid credentials"() {
        given:
        createAdminUser()

        when:
        def response = postRequest(BaseIT.LOGIN_API, [username: "admin@flix.com", password: "Admin@123"])
                .returnResult(ApiResponse)

        then:
        response.status == HttpStatus.OK
        response.responseBody.data.accessToken != null
    }

    def "should fail login with invalid credentials"() {
        given:
        def invalidUserCredential = [username: "asdasd", password: "asdasd"]

        when:
        def resp = postRequest(BaseIT.LOGIN_API, invalidUserCredential)
                .returnResult(ProblemDetail)

        then:
        resp.status == HttpStatus.UNAUTHORIZED
        resp.responseBody.detail == "Invalid username or password"
    }

    //Register Tests

    def "should register successfully with valid data"() {
        given:
        def userData = [username: "test", email: "test@gmail.com", password: "Test@123"]

        when:
        def response = postRequest(api, userData)
                .returnResult(ApiResponse)

        then:
        def userSaved = userRepository.findByEmail(userData.email).get()

        response.status == HttpStatus.CREATED
        response.responseBody.data.accessToken != null
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
        def responseNormalUser = postRequest(BaseIT.REGISTER_NORMAL_API, userDatas)
                .returnResult(ProblemDetail)
        def responseVipUser = postRequest(BaseIT.REGISTER_VIP_API, userDatas)
                .returnResult(ProblemDetail)

        then:
        responseNormalUser.status == HttpStatus.BAD_REQUEST
        responseVipUser.status == HttpStatus.BAD_REQUEST

        where:
        scenario               | userDatas
        "invalid email format" | [username: "test", email: "asdasd", password: "asdasd"]
        "weak password"        | [username: "test", email: "asdasda@gmail.com", password: "123"]
        "missing username"     | [username: "", email: "asdasda@gmail.com", password: "123"]
        "missing email"        | [username: "test", email: "", password: "123"]
        "missing password"     | [username: "test", email: "asdasda@gmail.com", password: ""]
    }

    def "should return true when provider is local"() {
        given:
        createNormalUser()
        String token = getNormalUserToken()

        when:
        def resp = getApiResponse(BaseIT.IS_LOCAL_PROVIDER, token)
                .returnResult(ApiResponse)

        then:
        resp.status == HttpStatus.OK
        resp.responseBody.data == true

    }

}
