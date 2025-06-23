package com.hahn.software.demo.backend.application.port.inbound;


import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request.LoginRequest;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request.RegisterRequest;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.response.AuthResponse;

public interface AuthServicePort {
    AuthResponse authenticateUser(LoginRequest loginRequest);
    AuthResponse registerUser(RegisterRequest registerRequest);
}