package com.flix.flixintegrationtest.catalog.api.paymentmethod

import com.flix.common.dto.ApiResponse
import com.flix.flixintegrationtest.common.BaseITSpec
import org.springframework.http.HttpStatus

class PaymentMethodIT extends BaseITSpec {

    def "should execute complete payment method CRUD and security flow"() {
        given:
        createAdminUser()
        createNormalUser()
        def adminToken = getAdminToken()
        def userToken = getNormalUserToken()

        when: "Admin creates a new payment method"
        def createResponse = postRequest("/catalog/payment-methods", [
                methodName: "CREDIT_CARD",
                isActive: true
        ], adminToken).returnResult(ApiResponse)

        then:
        createResponse.status == HttpStatus.CREATED
        def createdMethod = createResponse.responseBody.data as Map
        createdMethod.methodName == "CREDIT_CARD"
        createdMethod.isActive == true
        def paymentMethodId = (createdMethod.id as Number).longValue()

        when: "Customer retrieves active payment methods"
        def activeListResponse = getApiResponse("/catalog/payment-methods", userToken).returnResult(ApiResponse)

        then:
        activeListResponse.status == HttpStatus.OK
        def activeList = activeListResponse.responseBody.data as List
        activeList.any { (it as Map).id == paymentMethodId }

        when: "Admin updates payment method name"
        def updateResponse = putRequest("/catalog/payment-methods/${paymentMethodId}", [
                methodName: "VISA_CARD",
                isActive: true
        ], adminToken).returnResult(ApiResponse)

        then:
        updateResponse.status == HttpStatus.OK
        def updatedMethod = updateResponse.responseBody.data as Map
        updatedMethod.methodName == "VISA_CARD"

        when: "Admin deactivates payment method"
        def toggleResponse = patchRequest("/catalog/payment-methods/${paymentMethodId}/status?active=false", [:], adminToken).returnResult(ApiResponse)

        then:
        toggleResponse.status == HttpStatus.OK
        def toggledMethod = toggleResponse.responseBody.data as Map
        toggledMethod.isActive == false

        when: "Customer retrieves active payment methods again"
        def newActiveListResponse = getApiResponse("/catalog/payment-methods", userToken).returnResult(ApiResponse)

        then:
        newActiveListResponse.status == HttpStatus.OK
        def newActiveList = newActiveListResponse.responseBody.data as List
        !newActiveList.any { (it as Map).id == paymentMethodId }

        when: "Non-admin attempts to create a payment method"
        def forbiddenResponse = postRequest("/catalog/payment-methods", [
                methodName: "UNAUTHORIZED_METHOD",
                isActive: true
        ], userToken).returnResult(Object)

        then:
        forbiddenResponse.status == HttpStatus.FORBIDDEN

        when: "Admin deletes payment method"
        def deleteResponse = deleteRequest("/catalog/payment-methods/${paymentMethodId}", adminToken).returnResult(Object)

        then:
        deleteResponse.status == HttpStatus.NO_CONTENT
    }
}
