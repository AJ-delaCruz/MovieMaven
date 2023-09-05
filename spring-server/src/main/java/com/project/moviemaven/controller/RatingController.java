package com.project.moviemaven.controller;

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

import com.project.moviemaven.model.Rating;
import com.project.moviemaven.service.RatingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rating")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // movie ratings by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rating>> getRatingsByUser(@PathVariable Long userId) {
        List<Rating> ratings = ratingService.getRatingsByUser(userId);
        return ResponseEntity.ok(ratings);
    }

    // retrieve all ratings for movie from users
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

    // add rating
    @PostMapping("/{userId}/{movieId}")
    public ResponseEntity<String> addOrUpdateRating(
            @PathVariable Long userId,
            @PathVariable Long movieId,
            @RequestBody Float ratingValue) {

        ratingService.addOrUpdateRating(userId, movieId, ratingValue);

        return ResponseEntity.ok("Rating added for movie ID " + movieId);
    }

    // delete rating
    @DeleteMapping("/{userId}/{movieId}")
    public ResponseEntity<String> removeRating(@PathVariable Long userId, @PathVariable Long movieId) {
        ratingService.removeRating(userId, movieId);

        return ResponseEntity.ok("Rating removed");

    }

}
