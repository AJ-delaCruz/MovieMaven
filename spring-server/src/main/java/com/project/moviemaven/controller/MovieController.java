package com.project.moviemaven.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.model.Movie;
import com.project.moviemaven.service.MovieService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movie")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    // store movie from TMDB to database
    @GetMapping("/add/{tmdbId}")
    public Movie addMovie(@PathVariable Long tmdbId) {
        return movieService.addMovie(tmdbId);
    }

    // retrieve movie from db
    @GetMapping("/{id}")
    public Optional<Movie> getMovieById(@PathVariable Long id) {
        return movieService.getMovieFromDb(id);
    }

    // get all movies from db
    @GetMapping
    public List<Movie> getMovies() {
        return movieService.getMovies();
    }

    @DeleteMapping("/delete/{tmdbId}")
    public ResponseEntity<String> deleteMovie(@PathVariable Long tmdbId) {
        movieService.deleteMovie(tmdbId);

        return ResponseEntity.ok("TMDB ID " + tmdbId + " deleted");
    }

}
