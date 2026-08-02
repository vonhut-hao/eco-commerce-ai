package com.flix.common.advice;

import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.net.URI;
import java.time.DateTimeException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GlobalExceptionHandler {

    public static final String TIME_STAMP = "timestamp";

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleException(Exception e) {
        log.error("Unhandled exception: ", e);
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred"
        );
        problemDetail.setTitle("Internal Server Error");
        problemDetail.setProperty(TIME_STAMP, Instant.now());
        return problemDetail;
    }

    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handleBusinessException(BusinessException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        log.warn("Business exception: code={}, message={}", errorCode, exception.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                errorCode.getHttpStatus(),
                errorCode.getMessage()
        );
        problemDetail.setTitle("Business Error");
        problemDetail.setProperty(TIME_STAMP, Instant.now());
        return problemDetail;
    }

    @ExceptionHandler(DateTimeException.class)
    public ProblemDetail handleDateTimeException(DateTimeException exception) {
        log.warn("Date/Time exception: {}", exception.getMessage());
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Invalid date/time parameter: " + exception.getMessage()
        );
        problemDetail.setTitle("Invalid Date/Time");
        problemDetail.setProperty(TIME_STAMP, Instant.now());
        return problemDetail;
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ProblemDetail handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException exception) {
        log.warn("Method argument type mismatch: parameter={}, value={}", exception.getName(), exception.getValue());
        String detail = String.format("Invalid value '%s' for parameter '%s'", exception.getValue(), exception.getName());
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                detail
        );
        problemDetail.setTitle("Type Mismatch");
        problemDetail.setProperty(TIME_STAMP, Instant.now());
        return problemDetail;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Validation failed"
        );

        Map<String, String> errors = new HashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));

        problemDetail.setProperty("errors", errors);
        problemDetail.setProperty(TIME_STAMP, Instant.now());

        log.warn("Validation failed {}", errors);
        return problemDetail;
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleDataIntegrityViolationException(DataIntegrityViolationException exception) {
        log.warn("Data integrity violation: {}", exception.getMessage());

        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );
        problemDetail.setTitle("Data Integrity Violation");
        problemDetail.setProperty(TIME_STAMP, Instant.now());
        return problemDetail;
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.FORBIDDEN,
                "You do not have permission to access this resource."
        );
        problemDetail.setTitle("Forbidden");
        problemDetail.setInstance(URI.create(request.getRequestURI()));
        problemDetail.setProperty(TIME_STAMP, Instant.now());

        return problemDetail;
    }
}
