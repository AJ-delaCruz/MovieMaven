package com.project.moviemaven.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Review;
import com.project.moviemaven.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    // create a review
    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }

    // get all reviews from a specific movie
    public List<Review> getReviews(Long movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    // delete user review
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    public Review updateReview(Long id, Review updatedReview) {
        // find the review
        Review currentReview = reviewRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Review not found"));

        // Update properties of the review
        currentReview.setBody(updatedReview.getBody());
        currentReview.setRating(updatedReview.getRating());
        currentReview.setMovieId(updatedReview.getMovieId());
        currentReview.setUserId(updatedReview.getUserId());

        // Save updated review to the database
        return reviewRepository.save(currentReview);

    }
}
