package com.flix.flixintegrationtest.catalog.api.invoice

import com.flix.common.dto.ApiResponse
import com.flix.common.enums.Role
import com.flix.flixintegrationtest.common.BaseITSpec
import com.flix.identity.common.enums.AuthProvider
import com.flix.identity.entity.User
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType

class InvoiceIT extends BaseITSpec {

    def "should download invoice pdf for order owner and admin, reject for unauthorized user"() {
        given:
        createAdminUser()
        def user = createNormalUser()
        def userToken = getNormalUserToken()
        def adminToken = getAdminToken()

        // Create secondary user
        def otherUser = new User(
                username: "otherUser",
                email: "otherUser@gmail.com",
                password: '$2a$12$pmIXxQ7H.iNsd6BrXRbC/..DoMMuuFEfKml33imgyOuZklipEtpZ.',
                isEnabled: true,
                isVerified: true
        )
        otherUser.roles.add(Role.USER)
        otherUser.authProviders.add(AuthProvider.LOCAL)
        userRepository.save(otherUser)
        def otherUserToken = loginAndGetToken("otherUser", "Admin@123")

        // Create product
        def productResponse = postRequest("/catalog/products", [
                name: "Eco Thermal Bottle",
                price: 2500L,
                stock: 10,
                greenPoints: 12,
                ecoFriendliness: "high",
                carbonIndex: 1.2,
                mainImage: null,
                subImages: [],
                categoryIds: [],
                materialIds: []
        ], adminToken).returnResult(ApiResponse)
        def productId = (productResponse.responseBody.data as Map).id as Long

        // Add to cart & place order
        postRequest("/catalog/cart", [
                productId: productId,
                quantity: 1,
                userId: user.id
        ], userToken).returnResult(ApiResponse)

        def orderResponse = postRequest("/catalog/orders", [:], userToken).returnResult(ApiResponse)
        def orderId = ((orderResponse.responseBody.data as Map).id as Number).longValue()

        when: "Order owner downloads invoice PDF"
        def ownerPdfResponse = getApiResponse("/catalog/orders/${orderId}/invoice/pdf", userToken).returnResult(byte[])

        then:
        ownerPdfResponse.status == HttpStatus.OK
        ownerPdfResponse.responseHeaders.getFirst("Content-Type") == MediaType.APPLICATION_PDF_VALUE
        ownerPdfResponse.responseBody != null
        ownerPdfResponse.responseBody.length > 0

        when: "Admin downloads invoice PDF for customer order"
        def adminPdfResponse = getApiResponse("/catalog/orders/${orderId}/invoice/pdf", adminToken).returnResult(byte[])

        then:
        adminPdfResponse.status == HttpStatus.OK
        adminPdfResponse.responseHeaders.getFirst("Content-Type") == MediaType.APPLICATION_PDF_VALUE
        adminPdfResponse.responseBody != null
        adminPdfResponse.responseBody.length > 0

        when: "Unauthorized user attempts to download invoice PDF"
        def unauthorizedResponse = getApiResponse("/catalog/orders/${orderId}/invoice/pdf", otherUserToken).returnResult(Object)

        then:
        unauthorizedResponse.status == HttpStatus.NOT_FOUND || unauthorizedResponse.status == HttpStatus.FORBIDDEN
    }
}
