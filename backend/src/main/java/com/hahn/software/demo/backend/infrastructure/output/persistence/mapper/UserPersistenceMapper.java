package com.hahn.software.demo.backend.infrastructure.output.persistence.mapper;

import com.hahn.software.demo.backend.domain.aggregate.User;
import com.hahn.software.demo.backend.infrastructure.output.persistence.entity.UserEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserPersistenceMapper {

    public UserEntity toEntity(User user) {
        if (user == null) {
            return null;
        }

        UserEntity.UserEntityBuilder builder = UserEntity.builder()
                .id(user.getId())
                .email(user.getEmail())
                .passwordHash(user.getPasswordHash())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .isActive(user.isActive())
                .lastLogin(user.getLastLogin());


        return builder.build();
    }


    public User toDomain(UserEntity entity) {
        if (entity == null) {
            return null;
        }

        return User.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .passwordHash(entity.getPasswordHash())
                .fullName(entity.getFullName())
                .phone(entity.getPhone())
                .isActive(entity.isActive())
                .lastLogin(entity.getLastLogin())
                .build();
    }


    public List<User> toDomainList(List<UserEntity> entities) {
        if (entities == null) {
            return List.of();
        }

        return entities.stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }
}
