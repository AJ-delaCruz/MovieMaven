package com.project.moviemaven.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.repository.MovieRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final TMDBService tmdbService;

    // store movie from TMDB to database
    public Movie addMovie(Long tmdbId) {
        // check if tmdb movie already exists in database
        return movieRepository.findByTmdbId(tmdbId)
                .orElseGet(() -> {
                    // retrieve movie data from TMDB
                    Movie newMovie = tmdbService.getMovie(tmdbId);
                    //store to db
                    return movieRepository.save(newMovie);
                });
    }

    // find movie by TMDB ID
    public Movie getMovieByTmdbId(Long tmdbId) {
        return movieRepository.findByTmdbId(tmdbId)
                .orElseThrow(() -> new NotFoundException("Movie not found in TMDB"));
    }

    public List<Movie> getMovies() {
        return movieRepository.findAll();
    }

}
