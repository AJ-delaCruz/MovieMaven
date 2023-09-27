package com.project.moviemaven.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordRequest {
    private String currentPassword;
    private String newPassword;

}