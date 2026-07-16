package com.flix.flixintegrationtest.catalog.api.order

import com.flix.common.dto.ApiResponse
import com.flix.flixintegrationtest.common.BaseITSpec
import org.springframework.http.HttpStatus

class OrderIT extends BaseITSpec {

    def "should place order from cart and update stock and green points"() {
        given:
        createAdminUser()
        createNormalUser()
        def adminToken = getAdminToken()
        def userToken = getNormalUserToken()
        def user = userRepository.findByEmail("testNormalUser@gmail.com").get()

        def productResponse = postRequest("/catalog/products", [
                name: "Eco Mug",
                price: 1500L,
                stock: 5,
                greenPoints: 8,
                ecoFriendliness: "high",
                carbonIndex: 2.5,
                mainImage: null,
                subImages: [],
                categoryIds: [],
                materialIds: []
        ], adminToken).returnResult(ApiResponse)
        def productId = (productResponse.responseBody.data as Map).id as Long

        postRequest("/catalog/cart", [
                productId: productId,
                quantity: 2,
                userId: user.id
        ], userToken).returnResult(ApiResponse)

        when:
        def orderResponse = postRequest("/catalog/orders", [paymentMethodId: null], userToken).returnResult(ApiResponse)

        then:
        orderResponse.status == HttpStatus.OK
        def order = orderResponse.responseBody.data as Map
        order.status == "PENDING"
        order.totalAmount == 3000L
        (order.orderItems as List).size() == 1
        (order.orderItems[0] as Map).quantity == 2
        (order.orderItems[0] as Map).lineCarbonFootprint == 5.0d

        and:
        jdbc.queryForObject("SELECT stock FROM products WHERE id = ?", Integer, productId) == 3
        jdbc.queryForObject("SELECT green_points FROM user_profiles WHERE user_id = ?", Integer, user.id) == 16
        jdbc.queryForObject("SELECT total_carbon_index FROM user_profiles WHERE user_id = ?", Double, user.id) == 5.0d
        getApiResponse("/catalog/cart", userToken).returnResult(ApiResponse).responseBody.data.isEmpty()
    }

    def "should reject order when stock is insufficient"() {
        given:
        createAdminUser()
        createNormalUser()
        def adminToken = getAdminToken()
        def userToken = getNormalUserToken()
        def user = userRepository.findByEmail("testNormalUser@gmail.com").get()

        def productResponse = postRequest("/catalog/products", [
                name: "Soap Bar",
                price: 500L,
                stock: 2,
                greenPoints: 2,
                ecoFriendliness: "medium",
                carbonIndex: 1.0,
                mainImage: null,
                subImages: [],
                categoryIds: [],
                materialIds: []
        ], adminToken).returnResult(ApiResponse)
        def productId = (productResponse.responseBody.data as Map).id as Long

        postRequest("/catalog/cart", [
                productId: productId,
                quantity: 2,
                userId: user.id
        ], userToken).returnResult(ApiResponse)

        jdbc.execute("UPDATE products SET stock = 1 WHERE id = ${productId}")

        when:
        def response = postRequest("/catalog/orders", [:], userToken).returnResult(org.springframework.http.ProblemDetail)

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.responseBody.detail == "Insufficient stock"
    }
}
