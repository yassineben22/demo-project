package com.hahn.software.demo.backend.application.port.outbound;


import com.hahn.software.demo.backend.domain.aggregate.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepositoryPort {
    User save(User user);
    Optional<User> findById(UUID id);
    Optional<User> findByEmail(String email);
    List<User> findAll();
    void deleteById(UUID id);
    boolean existsByEmail(String email);
}
