package com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "110")
    @Email(message = "111")
    private String email;

    @NotBlank(message = "112")
    @Size(min = 6, message = "113")
    private String password;

    @NotBlank(message = "114")
    private String fullName;

    @NotBlank(message = "115")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "116")
    private String phone;
}