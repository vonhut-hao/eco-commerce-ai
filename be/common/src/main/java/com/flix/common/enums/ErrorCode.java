package com.flix.common.enums;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {

    USER_NOT_FOUND("User not found", HttpStatus.NOT_FOUND),
    INVALID_CREDENTIALS("Invalid username or password", HttpStatus.UNAUTHORIZED),
    EMAIL_ALREADY_EXISTS("Email already exists", HttpStatus.BAD_REQUEST),
    USERNAME_ALREADY_EXISTS("Username already exists", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED("Unauthenticated", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("Forbidden", HttpStatus.FORBIDDEN),
    CONVERSATION_NOT_FOUND("Conversation not found", HttpStatus.NOT_FOUND),
    CONVERSATION_ACCESS_DENIED("You do not have permission to access or modify this conversation", HttpStatus.FORBIDDEN),
    MESSAGE_NOT_FOUND("Message not found", HttpStatus.NOT_FOUND),
    MESSAGE_UPDATE_DENIED("You can only update your own messages", HttpStatus.FORBIDDEN),
    MESSAGE_DELETE_DENIED("You can only hide your own messages", HttpStatus.FORBIDDEN),
    CATEGORY_NOT_FOUND("Category not found", HttpStatus.NOT_FOUND),
    PRODUCT_NOT_FOUND("Product not found", HttpStatus.NOT_FOUND),
    MATERIAL_NOT_FOUND("Material not found", HttpStatus.NOT_FOUND),
    CERTIFICATE_NOT_FOUND("Certificate not found", HttpStatus.NOT_FOUND),
    COMMENT_NOT_FOUND("Comment not found", HttpStatus.NOT_FOUND),
    PARENT_COMMENT_NOT_FOUND("Parent comment not found", HttpStatus.NOT_FOUND),
    CART_ITEM_NOT_FOUND("Cart item not found", HttpStatus.NOT_FOUND),
    INSUFFICIENT_PRODUCT_STOCK("Insufficient product stock", HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND("Order not found", HttpStatus.NOT_FOUND),
    PAYMENT_METHOD_NOT_FOUND("Payment method not found", HttpStatus.NOT_FOUND),
    CART_EMPTY("Cart is empty", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_STOCK("Insufficient stock", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST("Invalid request", HttpStatus.BAD_REQUEST),
    INVALID_DATE("Invalid date provided", HttpStatus.BAD_REQUEST),
    INVALID_MONTH("Month must be between 1 and 12", HttpStatus.BAD_REQUEST),
    INVALID_DAY("Day must be between 1 and 31", HttpStatus.BAD_REQUEST),
    INVALID_YEAR("Year provided is invalid", HttpStatus.BAD_REQUEST),
    FUTURE_DATE_NOT_ALLOWED("Cannot calculate revenue for future dates", HttpStatus.BAD_REQUEST),
    INVALID_CALENDAR_DATE("The specified date, month, or year does not exist in the calendar", HttpStatus.BAD_REQUEST),
    STATISTIC_FILTER_REQUIRED("At least year filter must be provided", HttpStatus.BAD_REQUEST);


    String message;
    HttpStatus httpStatus;
}