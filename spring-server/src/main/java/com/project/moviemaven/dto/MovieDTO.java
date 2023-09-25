package com.project.moviemaven.dto;

import java.util.List;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovieDTO {
    private Long id;
    private String title;
    private String releaseDate;
    private List<String> genres;
    private String overview;
    private String tagline;
    private List<String> spokenLanguages;
    private Float popularity;
    private Float voteAverage;
    private Integer voteCount;
    private Integer runtime;

    private String backdropPath;
    private String posterPath;
    private String certification;

    private Set<String> actors;
    private Set<String> directors;

    private Float userRating;
}