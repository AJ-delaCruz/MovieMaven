package com.project.moviemaven.dto;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

import com.project.moviemaven.model.Role;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;
    private String fullName;
    @Builder.Default
    private Role role = Role.ROLE_USER; // Default role
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @Builder.Default
    private Set<MovieDTO> watchList = new LinkedHashSet<>();
    @Builder.Default
    private Set<MovieDTO> favorites = new LinkedHashSet<>();
    // @Builder.Default
    // private List<RatingDTO> ratings = new ArrayList<>();

}
