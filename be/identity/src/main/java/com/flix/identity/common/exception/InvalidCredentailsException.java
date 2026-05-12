package com.flix.identity.common.exception;

import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;

public class InvalidCredentailsException extends BusinessException {

    public InvalidCredentailsException(ErrorCode errorCode) {
        super(errorCode);
    }

    public InvalidCredentailsException() {
        super(ErrorCode.INVALID_CREDENTIALS);
    }

}
