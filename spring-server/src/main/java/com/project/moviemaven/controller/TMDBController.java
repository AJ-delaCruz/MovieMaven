package com.project.moviemaven.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.model.Movie;
import com.project.moviemaven.service.TMDBService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tmdb")
@CrossOrigin("*")
@RequiredArgsConstructor
public class TMDBController {

    private final TMDBService tmdbService;

    // get movie details from TMDB
    @GetMapping("/movie/{id}")
    public Movie getMovieDetails(@PathVariable Long id) {
        return tmdbService.getMovie(id);
    }

    // get a list of current movies from TMDB
    @GetMapping("/movies")
    public List<Movie> getMovies() {
        return tmdbService.getMovies();
    }

    // search for movies in TMDB
    @GetMapping("/search")
    public List<Movie> searchMovies(@RequestParam String query) {
        return tmdbService.searchMovie(query);
    }
}
