package com.project.moviemaven.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostDTO {

    private Long id;
    private Long movieId;
    private String text;

}
