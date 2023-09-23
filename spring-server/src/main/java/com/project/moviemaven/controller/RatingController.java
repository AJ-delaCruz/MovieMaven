package com.project.moviemaven.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.dto.MovieDTO;
import com.project.moviemaven.model.Rating;
import com.project.moviemaven.service.RatingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rating")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // add rating
    @PostMapping("/{movieId}")
    public ResponseEntity<String> addOrUpdateRating(Principal principal, @PathVariable Long movieId,
            @RequestBody Float ratingValue) {
        String username = principal.getName();

        ratingService.addOrUpdateRating(username, movieId, ratingValue);

        return ResponseEntity.ok("Rating added for movie ID " + movieId);
    }

    // delete rating
    @DeleteMapping("/{movieId}")
    public ResponseEntity<String> removeRating(Principal principal, @PathVariable Long movieId) {
        String username = principal.getName();
        ratingService.removeRating(username, movieId);

        return ResponseEntity.ok("Rating removed: " + movieId);

    }

    // retrieve movie ratings by user
    @GetMapping("/user")
    public ResponseEntity<List<Rating>> getRatingsByUser(Principal principal) {
        String username = principal.getName();
        List<Rating> ratings = ratingService.getRatingsByUser(username);
        return ResponseEntity.ok(ratings);
    }

    // retrieve all ratings for movie from all users
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Rating>> getRatingsForMovie(@PathVariable Long movieId) {
        List<Rating> ratings = ratingService.getRatingsForMovie(movieId);

        return ResponseEntity.ok(ratings);
    }

    // average rating for specific movie
    @GetMapping("movie/{movieId}/average")
    public ResponseEntity<Double> getAverageRatingForMovie(@PathVariable Long movieId) {
        Double avgRating = ratingService.getAverageRatingForMovie(movieId);

        return ResponseEntity.ok(avgRating);
    }

    // retrieve rated movies by user
    @GetMapping("/movie/rated")
    public ResponseEntity<List<MovieDTO>> getRatedMoviesByUser(Principal principal) {
        String username = principal.getName();

        List<MovieDTO> movies = ratingService.getRatedMoviesByUser(username);

        return ResponseEntity.ok(movies);
    }

}
