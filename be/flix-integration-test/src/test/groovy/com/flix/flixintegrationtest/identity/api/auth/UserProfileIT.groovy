package com.flix.flixintegrationtest.identity.api.auth


import com.flix.flixintegrationtest.common.BaseITSpec
import com.flix.flixintegrationtest.identity.config.BaseIT
import com.flix.identity.entity.UserProfile
import io.restassured.RestAssured

class UserProfileIT extends BaseITSpec {

    def "should create or update user profile successfully"() {
        given:
        createNormalUser()
        String token = getNormalUserToken()
        Map body = [avatarUrl: "asdasdasd", fullName: "Doe", phoneNumber: "0795823304"]

        when: "User creates profile for the first time"
        def resp = RestAssured.given()
                .header("Authorization", "Bearer " + token)
                .body(body)
                .post(BaseIT.PROFILE_API)
        Map userProfile = resp.body().jsonPath().getMap("data")

        then:
        resp.statusCode() == 201
        userProfile.avatarUrl == body.avatarUrl
        userProfile.fullName == body.fullName
        userProfile.phoneNumber == body.phoneNumber

        and:
        when: "User updates profile"
        Map updatedBody = [avatarUrl: "updatedUrl", fullName: "John Doe", phoneNumber: "0795823304"]
        def updateResp = RestAssured.given()
                .header("Authorization", "Bearer " + token)
                .body(updatedBody)
                .post(BaseIT.PROFILE_API)
        Map updatedProfile = updateResp.body().jsonPath().getMap("data")

        then:
        updateResp.statusCode() == 201
        updatedProfile.avatarUrl == updatedBody.avatarUrl
        updatedProfile.fullName == updatedBody.fullName
        updatedProfile.phoneNumber == updatedBody.phoneNumber
    }

    def "should update full user profile"() {
        given:
        createNormalUser()
        String token = getNormalUserToken()
        Map body = [avatarUrl: "asdasdasd", fullName: "Doe", phoneNumber: "0795823304"]
        def resp = RestAssured.given()
                .header("Authorization", "Bearer " + token)
                .body(body)
                .post(BaseIT.PROFILE_API)
        Map userProfile = resp.body().jsonPath().getMap("data")

        when:
        def updateResp = RestAssured.given()
                .header("Authorization", "Bearer " + token)
                .body(profileUpdateBodys)
                .post(BaseIT.PROFILE_API)
        Map updatedProfile = updateResp.body().jsonPath().getMap("data")

        then:
        updateResp.statusCode() == 201
        updatedProfile.avatarUrl == expectedAvatarUrl
        updatedProfile.fullName == expectedFullName
        updatedProfile.phoneNumber == expectedPhoneNumber


        where:
        scenario               | profileUpdateBodys                                                                | expectedAvatarUrl | expectedFullName | expectedPhoneNumber
        "missing avatar url"   | [fullName: "Doe", phoneNumber: "0906543210"]                                      | null              | "Doe"            | "0906543210"
        "missing phone number" | [avatarUrl: "avatar updated", fullName: "Doe"]                                    | "avatar updated"  | "Doe"            | null
        "full update"          | [avatarUrl: "avatar updated", fullName: "doe updated", phoneNumber: "0906543210"] | "avatar updated"  | "doe updated"    | "0906543210"

    }

}