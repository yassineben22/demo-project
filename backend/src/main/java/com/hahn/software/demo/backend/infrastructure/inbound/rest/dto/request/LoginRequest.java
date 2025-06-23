package com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "100")
    @Email(message = "101")
    private String email;

    @NotBlank(message = "102")
    @Size(min = 6, message = "103")
    private String password;
}