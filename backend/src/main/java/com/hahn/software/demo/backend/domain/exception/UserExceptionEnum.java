package com.hahn.software.demo.backend.domain.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum UserExceptionEnum {
    USER_NOT_FOUND("111"),
    EMAIL_ALREADY_EXISTS("112"),
    INVALID_USER_DATA("113"),
    INACTIVE_USER("114"),
    EMAIL_CHANGE_NOT_ALLOWED("115"),
    PROFILE_NOT_FOUND("116"),
    INSTITUTION_NOT_FOUND("117");

    private final String code;
}
