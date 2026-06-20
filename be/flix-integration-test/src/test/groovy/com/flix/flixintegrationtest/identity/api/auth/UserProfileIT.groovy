package com.flix.flixintegrationtest.identity.api.auth


import com.flix.common.dto.ApiResponse
import com.flix.flixintegrationtest.common.BaseITSpec
import com.flix.flixintegrationtest.identity.config.BaseIT
import org.springframework.http.HttpStatus

class UserProfileIT extends BaseITSpec {

    def "profile_0010 should create or update user profile successfully"() {
        given:
        createNormalUser()
        String token = getNormalUserToken()
        Map body = [avatarUrl: "asdasdasd", fullName: "Doe", phoneNumber: "0795823304"]

        when: "User creates profile for the first time"
        def resp = postRequest(BaseIT.PROFILE_API, body, token)
                .returnResult(ApiResponse)
        Map userProfile = resp.responseBody.data as Map

        then:
        resp.status == HttpStatus.CREATED
        userProfile.avatarUrl == body.avatarUrl
        userProfile.fullName == body.fullName
        userProfile.phoneNumber == body.phoneNumber

        and:
        when: "User updates profile"
        Map updatedBody = [avatarUrl: "updatedUrl", fullName: "John Doe", phoneNumber: "0795823304"]
        def updateResp = postRequest(BaseIT.PROFILE_API, updatedBody, token)
                .returnResult(ApiResponse)
        Map updatedProfile = updateResp.responseBody.data as Map

        then:
        updateResp.status == HttpStatus.CREATED
        updatedProfile.avatarUrl == updatedBody.avatarUrl
        updatedProfile.fullName == updatedBody.fullName
        updatedProfile.phoneNumber == updatedBody.phoneNumber
    }

    def "profile_0020 should update full user profile"() {
        given:
        createNormalUser()
        String token = getNormalUserToken()
        Map body = [avatarUrl: "asdasdasd", fullName: "Doe", phoneNumber: "0795823304"]
        def resp = postRequest(BaseIT.PROFILE_API, body, token)
                .returnResult(ApiResponse)
        Map userProfile = resp.responseBody.data as Map

        when:
        def updateResp = postRequest(BaseIT.PROFILE_API, profileUpdateBodys, token)
                .returnResult(ApiResponse)
        Map updatedProfile = updateResp.responseBody.data as Map

        then:
        updateResp.status == HttpStatus.CREATED
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
