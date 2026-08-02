package com.flix.flixintegrationtest.identity.api.address

import com.flix.common.dto.ApiResponse
import com.flix.flixintegrationtest.common.BaseITSpec
import org.springframework.http.HttpStatus

class AddressIT extends BaseITSpec {

    def "should execute complete address E2E lifecycle successfully"() {
        given: "A registered user and authentication token"
        createNormalUser()
        String token = getNormalUserToken()
        String endpoint = "/identity/addresses"

        when: "1. User creates their first address (should auto-set as default)"
        Map addr1Req = [
                recipientName: "John Doe",
                phoneNumber  : "0912345678",
                fullAddress  : "123 Main St, New York, NY",
                isDefault    : false
        ]
        def createResp1 = postRequest(endpoint, addr1Req, token).returnResult(ApiResponse)
        Map addr1 = createResp1.responseBody.data as Map

        then: "First address is created and marked as default"
        createResp1.status == HttpStatus.CREATED
        addr1.id != null
        addr1.recipientName == addr1Req.recipientName
        addr1.phoneNumber == addr1Req.phoneNumber
        addr1.fullAddress == addr1Req.fullAddress
        addr1.isDefault == true

        when: "2. User creates a second address (not default)"
        Map addr2Req = [
                recipientName: "Jane Doe",
                phoneNumber  : "0987654321",
                fullAddress  : "456 Market St, San Francisco, CA",
                isDefault    : false
        ]
        def createResp2 = postRequest(endpoint, addr2Req, token).returnResult(ApiResponse)
        Map addr2 = createResp2.responseBody.data as Map

        then: "Second address is created with isDefault = false"
        createResp2.status == HttpStatus.CREATED
        addr2.id != null
        addr2.isDefault == false

        when: "3. User lists all their addresses"
        def listResp = getApiResponse(endpoint, token).returnResult(ApiResponse)
        List<Map> addressList = listResp.responseBody.data as List<Map>

        then: "List contains both created addresses"
        listResp.status == HttpStatus.OK
        addressList.size() == 2

        when: "4. User fetches details of address 1"
        def detailResp = getApiResponse("${endpoint}/${addr1.id}", token).returnResult(ApiResponse)
        Map fetchedAddr1 = detailResp.responseBody.data as Map

        then: "Fetched details match address 1"
        detailResp.status == HttpStatus.OK
        fetchedAddr1.id == addr1.id
        fetchedAddr1.recipientName == addr1Req.recipientName

        when: "5. User updates address 1 details"
        Map updateReq = [
                recipientName: "John Updated",
                phoneNumber  : "0999999999",
                fullAddress  : "123 Main St Updated, New York, NY",
                isDefault    : true
        ]
        def updateResp = putRequest("${endpoint}/${addr1.id}", updateReq, token).returnResult(ApiResponse)
        Map updatedAddr1 = updateResp.responseBody.data as Map

        then: "Address 1 details are updated"
        updateResp.status == HttpStatus.OK
        updatedAddr1.recipientName == "John Updated"
        updatedAddr1.phoneNumber == "0999999999"

        when: "6. User sets address 2 as default"
        def setDefaultResp = patchRequest("${endpoint}/${addr2.id}/default", [:], token).returnResult(ApiResponse)
        Map defaultAddr2 = setDefaultResp.responseBody.data as Map

        then: "Address 2 is now default"
        setDefaultResp.status == HttpStatus.OK
        defaultAddr2.isDefault == true

        and: "Address 1 is no longer default when re-fetched"
        def refetchAddr1 = getApiResponse("${endpoint}/${addr1.id}", token).returnResult(ApiResponse)
        (refetchAddr1.responseBody.data as Map).isDefault == false

        when: "7. User deletes address 1"
        def deleteResp = deleteRequest("${endpoint}/${addr1.id}", token).returnResult(Void)

        then: "Address 1 is deleted"
        deleteResp.status == HttpStatus.NO_CONTENT

        and: "User has only 1 address remaining"
        def finalListResp = getApiResponse(endpoint, token).returnResult(ApiResponse)
        (finalListResp.responseBody.data as List<Map>).size() == 1
    }
}
