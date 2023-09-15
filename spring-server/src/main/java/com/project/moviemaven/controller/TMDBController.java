package com.project.moviemaven.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.model.Movie;
import com.project.moviemaven.service.TMDBService;

import info.movito.themoviedbapi.model.MovieDb;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tmdb")
@RequiredArgsConstructor
public class TMDBController {

    private final TMDBService tmdbService;

    // get raw movie details from TMDB
    @GetMapping("/raw/movie/{id}")
    public ResponseEntity<MovieDb> getTmdbMovie(@PathVariable Long id) {
        MovieDb movie = tmdbService.getTmdbMovie(id);
        return ResponseEntity.ok(movie);
    }

    // get movie details from TMDB, converts to Movie object (w. cast/certification)
    @GetMapping("/movie/{id}")
    public ResponseEntity<Movie> getMovieAndConvert(@PathVariable Long id) {
        Movie movie = tmdbService.getMovieAndConvert(id);
        return ResponseEntity.ok(movie);
    }

    // get a list of current movies from TMDB
    @GetMapping("/movies/playing")
    public ResponseEntity<List<MovieDb>> getCurrentMovies(@RequestParam(defaultValue = "1") int page) { // /api/tmdb/movies/playing?page=1

        List<MovieDb> movies = tmdbService.getCurrentMovies(page);
        return ResponseEntity.ok(movies);

    }

    @GetMapping("/movies/filter")
    public ResponseEntity<List<MovieDb>> getMovies(@RequestParam(required = false) String genre,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "1") int page) {
        List<MovieDb> movies = tmdbService.getMoviesByFilter(genre, category, page);
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/byGenre")
    public ResponseEntity<List<MovieDb>> getMoviesByGenre(
            @RequestParam String genreName,
            @RequestParam(defaultValue = "1") int page) {
        List<MovieDb> movies = tmdbService.getMoviesByGenre(genreName, page);

        return ResponseEntity.ok(movies);
    }

    // get US certification (for testing, used as a service)
    @GetMapping("/release/{id}")
    public ResponseEntity<String> getUSCertificationForMovie(@PathVariable long id) {
        String certifcate = tmdbService.getUSCertificationForMovie(id);
        return ResponseEntity.ok(certifcate);
    }

    // search for movies in TMDB
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchMovies(@RequestParam String query,
            @RequestParam(defaultValue = "1") int page) { // search?query=Barbie&page=1
        Map<String, Object> result = tmdbService.searchMovie(query, page);
        return ResponseEntity.ok(result);
    }

}
