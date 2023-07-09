package com.project.moviemaven.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.model.Movie;
import com.project.moviemaven.service.MovieService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movie")
@CrossOrigin("*")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    // retrieve movie from db
    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Long id) {
        return movieService.getMovieFromDb(id);
    }

    //get all movies from db
    @GetMapping
    public List<Movie> getMovies() {
        return movieService.getMovies();
    }

}
