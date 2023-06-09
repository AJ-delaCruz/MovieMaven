package com.project.moviemaven.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.model.Review;
import com.project.moviemaven.service.ReviewService;

@RestController
@RequestMapping("/api/review")
@CrossOrigin("*")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    @GetMapping("/movie/{movieId}")
    public List<Review> getReviews(@PathVariable Long movieId) {
        return reviewService.getReviews(movieId);
    }

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
    }

    // update review
    @PutMapping("/{id}")
    public void updateReview(@PathVariable Long id, @RequestBody Review review) {
        reviewService.updateReview(id, review);
    }
}
