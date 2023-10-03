package com.project.moviemaven.dto;

import java.time.LocalDateTime;

import com.project.moviemaven.model.Post;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostDTO {

    private Long id;
    private Long movieId;
    private String text;
    private Integer likesCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String username;
    private Boolean isAuthor;

    public static PostDTO toDTO(Post post, String currentUsername) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setMovieId(post.getMovie().getId()); 
        dto.setText(post.getText());
        dto.setLikesCount(post.getLikesCount());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());

        dto.setUsername(post.getUser().getUsername());
        dto.setIsAuthor(post.getUser().getUsername().equals(currentUsername));

        return dto;
    }
}
