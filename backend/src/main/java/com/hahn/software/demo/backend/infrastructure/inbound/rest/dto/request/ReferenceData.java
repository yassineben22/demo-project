package com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReferenceData implements Serializable {

    @NotBlank(message = "120")
    private String deviceId;

    @NotBlank(message = "121")
    private String lang;

    @NotBlank(message = "122")
    private String channel;

    private String systemVersion;
    private String version;
    private String customerId;
    private String infoType;
    private String step;
    private String guide;
    private String timestamp;
}