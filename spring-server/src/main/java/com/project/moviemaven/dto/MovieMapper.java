package com.project.moviemaven.dto;

import com.project.moviemaven.model.Movie;

public class MovieMapper {

    public static MovieDTO toMovieDTO(Movie movie) {
        MovieDTO dto = new MovieDTO();
        dto.setId(movie.getTmdbId());
        dto.setTitle(movie.getTitle());
        dto.setReleaseDate(movie.getReleaseDate());
        // dto.setGenres(movie.getGenres());
        dto.setOverview(movie.getOverview());
        // dto.setTagline(movie.getTagline());
        dto.setBackdropPath(movie.getBackdropPath());
        dto.setPosterPath(movie.getPosterPath());
        // dto.setSpokenLanguages(movie.getSpokenLanguages());
        dto.setVoteAverage(movie.getVoteAverage());
        return dto;
    }
}
