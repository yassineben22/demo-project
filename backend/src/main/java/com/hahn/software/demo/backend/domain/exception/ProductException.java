package com.hahn.software.demo.backend.domain.exception;

public class ProductException extends RuntimeException {
    private final String code;

    public ProductException(String code) {
        super();
        this.code = code;
    }

    public ProductException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
