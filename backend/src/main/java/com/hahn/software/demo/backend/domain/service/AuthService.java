package com.hahn.software.demo.backend.domain.service;


import com.hahn.software.demo.backend.application.port.inbound.AuthServicePort;
import com.hahn.software.demo.backend.application.port.outbound.UserRepositoryPort;
import com.hahn.software.demo.backend.domain.exception.EmailAlreadyExistsException;
import com.hahn.software.demo.backend.infrastructure.config.security.CustomUserDetailsService;
import com.hahn.software.demo.backend.infrastructure.config.security.JwtUtils;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request.LoginRequest;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.request.RegisterRequest;
import com.hahn.software.demo.backend.infrastructure.inbound.rest.dto.response.AuthResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.hahn.software.demo.backend.domain.aggregate.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService implements AuthServicePort {

    private final AuthenticationManager authenticationManager;
    private final UserRepositoryPort userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtils.generateToken(userDetails);

            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

            return AuthResponse.builder()
                    .token(jwt)
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .build();
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return null;
    }

    @Override
    public AuthResponse registerUser(RegisterRequest registerRequest) {
        // Check if email exists
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        // Create new user
        User user = User.builder()
                .id(UUID.randomUUID())
                .email(registerRequest.getEmail())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .phone(registerRequest.getPhone())
                .isActive(true)
                .lastLogin(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String jwt = jwtUtils.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwt)
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .build();
    }
}