package com.project.moviemaven.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.service.TMDBService;

import info.movito.themoviedbapi.model.MovieDb;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tmdb")
@RequiredArgsConstructor
public class TMDBController {

    private final TMDBService tmdbService;

    // get raw movie details from TMDB
    @GetMapping("/direct/movie/{id}")
    public ResponseEntity<MovieDb> getTmdbMovie(@PathVariable Long id) {
        MovieDb movie = tmdbService.getTmdbMovie(id);
        return ResponseEntity.ok(movie);
    }

    // get a list of current movies from TMDB
    @GetMapping("/movies")
    public ResponseEntity<List<MovieDb>> getMovies() {
        List<MovieDb> movies = tmdbService.getMovies();
        return ResponseEntity.ok(movies);

    }

    // search for movies in TMDB
    @GetMapping("/search")
    public ResponseEntity<List<MovieDb>> searchMovies(@RequestParam String query) { // search?query=Barbie
        List<MovieDb> movies = tmdbService.searchMovie(query);
        return ResponseEntity.ok(movies);
    }

    // // get movie details from TMDB, converts Moviedb object to Movie object
    // @GetMapping("/movie/{id}")
    // public ResponseEntity<Movie> getMovie(@PathVariable Long id) {
    // Movie movie = tmdbService.getMovie(id);
    // return ResponseEntity.ok(movie);
    // }
}
