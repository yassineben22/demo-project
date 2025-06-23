package com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseBody<T, K> {


    private String statusCode;
    private String statusMessage;
    private String statusLabel;

    private T responseData;

    private K referenceData;

    @Builder
    public ResponseBody(String status, String message, T responseData, K referenceData) {
        this.statusCode = status;
        this.statusLabel = message;
        this.responseData = responseData;
        this.referenceData = referenceData;
    }
}