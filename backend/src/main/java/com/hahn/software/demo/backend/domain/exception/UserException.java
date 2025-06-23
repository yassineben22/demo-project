package com.hahn.software.demo.backend.domain.exception;

import lombok.Getter;

@Getter
public class UserException extends RuntimeException {
    private final String code;

    public UserException(String code) {
        super(code);
        this.code = code;
    }

}
