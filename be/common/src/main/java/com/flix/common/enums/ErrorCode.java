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

    //ErrorCode Conversation
    CONVERSATION_NOT_FOUND("Conversation not found", HttpStatus.NOT_FOUND),
    CONVERSATION_ACCESS_DENIED("You do not have permission to access or modify this conversation", HttpStatus.FORBIDDEN),

    //ErrorCode Message
    MESSAGE_NOT_FOUND("Message not found", HttpStatus.NOT_FOUND),
    MESSAGE_UPDATE_DENIED("You can only update your own messages", HttpStatus.FORBIDDEN),
    MESSAGE_DELETE_DENIED("You can only hide your own messages", HttpStatus.FORBIDDEN),
    ;

    String message;
    HttpStatus httpStatus;
}
