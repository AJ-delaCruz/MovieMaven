package com.project.moviemaven.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.Rating;
import com.project.moviemaven.repository.MovieRepository;
import com.project.moviemaven.repository.RatingRepository;
import com.project.moviemaven.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final MovieService movieService;

    // retrieve movie ratings by user
    public List<Rating> getRatingsByUser(Long userId) {
        return ratingRepository.findByUserId(userId);
    }

    // retrieve all ratings for movie from all users
    public List<Rating> getRatingsForMovie(Long movieId) { // TODO display individual user ratings w/ review?
        return ratingRepository.findByMovieId(movieId);
    }

    // average rating for specific movie
    public Double getAverageRatingForMovie(Long movieId) {
        List<Rating> ratings = ratingRepository.findByMovieId(movieId);

        if (ratings.isEmpty()) {
            throw new NotFoundException("No ratings found in database for movieId: " + movieId);
        }

        return ratings.stream()
                // .mapToDouble(Rating::getRatingValue)
                .mapToDouble(x -> x.getRatingValue()) // extract all ratings
                .average()
                .orElse(0.0); // default to 0 if there are no ratings
    }

    // add rating
    @Transactional
    public void addOrUpdateRating(Long userId, Long tmdbId, Float ratingValue) {
        if (ratingValue < 1 || ratingValue > 10) {
            throw new IllegalArgumentException("Rating value must be between 1 and 10");
        }

        // Check if movie exists in the 'Movie' postgres table
        Movie movie = movieRepository.findByTmdbId(tmdbId).orElse(null);

        // if not, add to db
        if (movie == null) {
            // retrieve movie from TMDB, convert to 'Movie' object, and store to db
            movie = movieService.addMovie(tmdbId);
        }

        // check if it's already rated
        Rating rating = ratingRepository.findByUserIdAndMovieId(userId, movie.getId()) // local movie id
                .orElse(new Rating());

        rating.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found in database")));

        rating.setMovie(movie);
        rating.setRatingValue(ratingValue);
        rating.setDate(LocalDateTime.now());

        ratingRepository.save(rating);
    }

    // delete rating
    public void removeRating(Long userId, Long movieId) {
        Rating existingRating = ratingRepository.findByUserIdAndMovieId(userId, movieId)
                .orElseThrow(() -> new NotFoundException("No rating found for " + movieId + " in database"));

        ratingRepository.delete(existingRating);

    }
}
