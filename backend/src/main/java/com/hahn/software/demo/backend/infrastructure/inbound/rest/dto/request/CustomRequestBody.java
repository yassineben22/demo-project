package com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class CustomRequestBody<T, K> {

    @NotNull(message = "130")
    @Valid
    private T requestData;


    @NotNull(message = "131")
    @Valid
    private K referenceData;
}