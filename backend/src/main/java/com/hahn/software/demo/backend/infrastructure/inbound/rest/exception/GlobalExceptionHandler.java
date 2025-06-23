package com.hahn.software.demo.backend.infrastructure.inbound.rest.exception;

import com.hahn.software.demo.backend.domain.exception.EmailAlreadyExistsException;
import com.hahn.software.demo.backend.domain.exception.UserException;
import com.hahn.software.demo.backend.domain.exception.UserNotFoundException;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request.ReferenceData;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.response.ResponseBody;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseBody<Map<String, String>, ReferenceData>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = "";
            if (error instanceof FieldError) {
                fieldName = ((FieldError) error).getField();
            }

            String errorCode = error.getDefaultMessage(); // This will contain our error codes (100, 101, etc.)
            errors.put(fieldName, errorCode);
        });

        ResponseBody<Map<String, String>, ReferenceData> responseBody = new ResponseBody<>(
                "199", // General validation error code
                "Validation failed",
                errors,
                null // No reference data available in validation errors
        );

        return ResponseEntity.badRequest().body(responseBody);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ResponseBody<Object, ReferenceData>> handleUserNotFoundException(
            UserNotFoundException ex) {

        ResponseBody<Object, ReferenceData> responseBody = new ResponseBody<>(
                "199", // User not found error code
                ex.getMessage(),
                null,
                null
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(responseBody);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ResponseBody<Object, ReferenceData>> handleEmailAlreadyExistsException(
            EmailAlreadyExistsException ex) {

        ResponseBody<Object, ReferenceData> responseBody = new ResponseBody<>(
                "199", // Email already exists error code
                ex.getMessage(),
                null,
                null
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(responseBody);
    }

    @ExceptionHandler(UserException.class)
    public ResponseEntity<ResponseBody<Object, ReferenceData>> handleUserException(
            UserException ex) {

        ResponseBody<Object, ReferenceData> responseBody = new ResponseBody<>(
                ex.getCode(), // Use the specific error code from the exception
                ex.getMessage(),
                null,
                null
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseBody<Object, ReferenceData>> handleGeneralExceptions(
            Exception ex) {
        log.error(ex.getMessage(), ex);
        ResponseBody<Object, ReferenceData> responseBody = new ResponseBody<>(
                "199", // Generic system error code
                "An unexpected error occurred: " + ex.getMessage(),
                null,
                null
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }
}
