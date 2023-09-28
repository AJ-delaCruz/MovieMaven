package com.project.moviemaven.service;

import java.util.List;
import java.util.Optional;

import org.springframework.cache.annotation.Cacheable;
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
        Movie newMovie = tmdbService.getMovieAndConvert(tmdbId);
        // store to db
        return movieRepository.save(newMovie);
    }

    // get movie using TMDB movie ID from database
    @Cacheable(value = "movie", key = "#tmdbId")
    public Optional<Movie> getMovieFromDb(Long tmdbId) {
        // return movieRepository.findByTmdbId(tmdbId)
        // .orElseThrow(() -> new NotFoundException("Movie not found in database"));
        return movieRepository.findByTmdbId(tmdbId);

    }

    // get movie or store to db if it doesn't exist
    public Movie getOrAddMovieToDb(Long tmdbId) {
        // check if tmdb movie already exists in database
        return getMovieFromDb(tmdbId)
                .orElseGet(() -> addMovie(tmdbId)); // store to tmdb movie to db
    }

    public List<Movie> getMovies() {
        return movieRepository.findAll();
    }

    public void deleteMovie(Long tmdbId) {
        Movie existingMovie = movieRepository.findByTmdbId(tmdbId)
                .orElseThrow(() -> new NotFoundException("No movie found with tmdb Id " + tmdbId));

        movieRepository.delete(existingMovie);

    }

}
