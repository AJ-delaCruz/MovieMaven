package com.project.moviemaven.service;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.moviemaven.model.Review;
import com.project.moviemaven.repository.ReviewRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;


    //create a review
    public Review addReview(Review review){
        return reviewRepository.save(review);
    }

    //get all reviews from a specific movie
    public List<Review> getReviews(ObjectId movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    //delete user review
    public void deleteReview(ObjectId id) {
        reviewRepository.deleteById(id);
    }
    
}
