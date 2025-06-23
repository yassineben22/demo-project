package com.hahn.software.demo.backend.infrastructure.inbound.rest.controller.auth;

import com.hahn.software.demo.backend.application.port.inbound.AuthServicePort;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request.CustomRequestBody;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request.LoginRequest;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request.ReferenceData;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request.RegisterRequest;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.response.AuthResponse;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.response.ResponseBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServicePort authService;

    @PostMapping("/login")
    public ResponseEntity<ResponseBody<AuthResponse, ReferenceData>> authenticateUser(
            @Valid @RequestBody CustomRequestBody<LoginRequest, ReferenceData> requestBody) {

        LoginRequest loginRequest = requestBody.getRequestData();
        ReferenceData referenceData = requestBody.getReferenceData();

        AuthResponse authResponse = authService.authenticateUser(loginRequest);

        ResponseBody<AuthResponse, ReferenceData> responseBody =
                new ResponseBody<>(
                        "000",
                        "Authentication successful",
                        authResponse,
                        referenceData
                );

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseBody<AuthResponse, ReferenceData>> registerUser(
            @Valid @RequestBody CustomRequestBody<RegisterRequest, ReferenceData> requestBody) {

        RegisterRequest registerRequest = requestBody.getRequestData();
        ReferenceData referenceData = requestBody.getReferenceData();

        AuthResponse authResponse = authService.registerUser(registerRequest);

        ResponseBody<AuthResponse, ReferenceData> responseBody =
                new ResponseBody<>(
                        "000",
                        "Registration successful",
                        authResponse,
                        referenceData
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
    }
}