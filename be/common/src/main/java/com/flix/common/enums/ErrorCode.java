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
    USER_DISABLED("User account is disabled", HttpStatus.FORBIDDEN),
    ADMIN_SELF_DISABLE_NOT_ALLOWED("Admin user cannot disable their own account", HttpStatus.BAD_REQUEST),
    ADMIN_STATUS_CHANGE_NOT_ALLOWED("Cannot change account status of another administrator", HttpStatus.BAD_REQUEST),
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

    // Order Error Codes
    ORDER_NOT_FOUND("Order not found", HttpStatus.NOT_FOUND),
    ORDER_TOTAL_INVALID("Order total amount is invalid", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_COMPLETED("Order is already completed", HttpStatus.BAD_REQUEST),
    ORDER_IN_DELIVERY("Order is currently in delivery", HttpStatus.BAD_REQUEST),
    ORDER_CANNOT_CANCEL("Order cannot be cancelled in its current status", HttpStatus.BAD_REQUEST),
    ORDER_CANNOT_UPDATE_PROMOTION("Cannot update promotion for this order", HttpStatus.BAD_REQUEST),
    ORDER_NOT_ENOUGH_FOR_PROMOTION("Order total value does not meet the minimum requirement for promotion", HttpStatus.BAD_REQUEST),

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
    STATISTIC_FILTER_REQUIRED("At least year filter must be provided", HttpStatus.BAD_REQUEST),

    // Promotion Error Codes
    PROMOTION_NOT_FOUND("Promotion not found", HttpStatus.NOT_FOUND),
    PROMOTION_CODE_ALREADY_EXISTS("Promotion code already exists", HttpStatus.BAD_REQUEST),
    PROMOTION_INACTIVE("Promotion is not active", HttpStatus.BAD_REQUEST),
    PROMOTION_NOT_ACTIVE("Promotion is not active or has been locked", HttpStatus.BAD_REQUEST),
    PROMOTION_INVALID_DATE("Promotion start or end date is invalid", HttpStatus.BAD_REQUEST),
    INVALID_PROMOTION_DATE("Promotion start date must be before end date", HttpStatus.BAD_REQUEST),
    PROMOTION_NOT_STARTED("Promotion has not started yet", HttpStatus.BAD_REQUEST),
    PROMOTION_EXPIRED("Promotion has expired", HttpStatus.BAD_REQUEST),
    PROMOTION_OUT_OF_USAGE("Promotion usage limit has been reached", HttpStatus.BAD_REQUEST),
    PROMOTION_USAGE_LIMIT_EXCEEDED("Promotion usage limit reached", HttpStatus.BAD_REQUEST),
    PROMOTION_USAGE_COUNT_INVALID("Promotion usage count is invalid", HttpStatus.BAD_REQUEST),
    PROMOTION_MIN_ORDER_VALUE_NOT_MET("Order value does not meet the minimum requirement for this promotion", HttpStatus.BAD_REQUEST),
    INVALID_PROMOTION_DISCOUNT_VALUE("Discount value is invalid for the selected discount type", HttpStatus.BAD_REQUEST),
    PROMOTION_INVALID_DISCOUNT_VALUE("Promotion discount value is invalid", HttpStatus.BAD_REQUEST),
    PROMOTION_DISCOUNT_EXCEEDS_ORDER_TOTAL("Promotion discount exceeds total order amount", HttpStatus.BAD_REQUEST),
    PROMOTION_ALREADY_USED_BY_USER("Promotion has already been used by this user", HttpStatus.BAD_REQUEST);

    String message;
    HttpStatus httpStatus;
}