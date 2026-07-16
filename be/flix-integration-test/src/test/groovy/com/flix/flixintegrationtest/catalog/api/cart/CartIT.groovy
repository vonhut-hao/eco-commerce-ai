package com.flix.flixintegrationtest.catalog.api.cart

import com.flix.common.dto.ApiResponse
import com.flix.flixintegrationtest.common.BaseITSpec
import org.springframework.http.HttpStatus

class CartIT extends BaseITSpec {

    def "should manage cart items with unified create or update flow"() {
        given:
        createAdminUser()
        createNormalUser()
        def adminToken = getAdminToken()
        def userToken = getNormalUserToken()
        def user = userRepository.findByEmail("testNormalUser@gmail.com").get()

        def productResponse = postRequest("/catalog/products", [
                name: "Reusable Bottle",
                price: 1200L,
                stock: 10,
                greenPoints: 5,
                ecoFriendliness: "high",
                carbonIndex: 1.5,
                mainImage: null,
                subImages: [],
                categoryIds: [],
                materialIds: []
        ], adminToken).returnResult(ApiResponse)
        def productId = (productResponse.responseBody.data as Map).id as Long

        when:
        def addResponse = postRequest("/catalog/cart", [
                productId: productId,
                quantity: 1,
                userId: user.id
        ], userToken).returnResult(ApiResponse)

        then:
        addResponse.status == HttpStatus.OK
        def addedItem = addResponse.responseBody.data as Map
        addedItem.quantity == 1
        addedItem.productId == productId
        addedItem.productName == "Reusable Bottle"

        when:
        def mergeResponse = postRequest("/catalog/cart", [
                productId: productId,
                quantity: 2,
                userId: user.id
        ], userToken).returnResult(ApiResponse)

        then:
        mergeResponse.status == HttpStatus.OK
        def mergedItem = mergeResponse.responseBody.data as Map
        mergedItem.id == addedItem.id
        mergedItem.quantity == 3

        when:
        def updateResponse = postRequest("/catalog/cart/${addedItem.id}", [
                productId: productId,
                quantity: 4,
                userId: user.id
        ], userToken).returnResult(ApiResponse)

        then:
        updateResponse.status == HttpStatus.OK
        def updatedItem = updateResponse.responseBody.data as Map
        updatedItem.id == addedItem.id
        updatedItem.quantity == 4

        when:
        def listResponse = getApiResponse("/catalog/cart", userToken).returnResult(ApiResponse)

        then:
        listResponse.status == HttpStatus.OK
        def items = listResponse.responseBody.data as List
        items.size() == 1
        (items[0] as Map).quantity == 4
        (items[0] as Map).productName == "Reusable Bottle"

        when:
        deleteRequest("/catalog/cart/${addedItem.id}", userToken)
        def emptyListResponse = getApiResponse("/catalog/cart", userToken).returnResult(ApiResponse)

        then:
        emptyListResponse.status == HttpStatus.OK
        (emptyListResponse.responseBody.data as List).isEmpty()
    }
}
