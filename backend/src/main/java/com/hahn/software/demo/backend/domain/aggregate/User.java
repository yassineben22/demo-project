package com.hahn.software.demo.backend.domain.aggregate;


import com.hahn.software.demo.backend.domain.exception.UserException;
import com.hahn.software.demo.backend.domain.exception.UserExceptionEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private UUID id;
    private String email;
    private boolean isActive;
    private String fullName;
    private String phone;
    private String passwordHash;
    private LocalDateTime lastLogin;
    private UUID profileId;
    private UUID institutionId;


    public void setProfile(UUID profileId) {
        if (profileId == null) {
            throw new UserException(UserExceptionEnum.PROFILE_NOT_FOUND.getCode());
        }
        this.profileId = profileId;
    }

    public void setInstitution(UUID institutionId) {
        if (institutionId == null) {
            throw new UserException(UserExceptionEnum.INSTITUTION_NOT_FOUND.getCode());
        }
        this.institutionId = institutionId;
    }
}