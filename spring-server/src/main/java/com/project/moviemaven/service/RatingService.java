package com.project.moviemaven.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.Rating;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.RatingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserService userService;
    private final MovieService movieService;

    // add or update rating
    @Transactional
    public void addOrUpdateRating(String username, Long tmdbId, Float ratingValue) {
        if (ratingValue < 1 || ratingValue > 10) {
            throw new IllegalArgumentException("Rating value must be between 1 and 10");
        }
        User user = userService.getUserByUsername(username); // retrieve user from db

        // retrieve movie from TMDB else convert to 'Movie' object and store to db
        Movie movie = movieService.getOrAddMovieToDb(tmdbId);

        // check if it's already rated
        Rating rating = ratingRepository.findByUserIdAndMovieId(user.getId(), movie.getId()) // local movie id
                .orElse(new Rating());

        rating.setUser(user);
        rating.setMovie(movie);
        rating.setRatingValue(ratingValue);
        ratingRepository.save(rating);
    }

    // delete rating for specific movie
    @Transactional
    public void removeRating(String username, Long movieId) {
        User user = userService.getUserByUsername(username); // retrieve user from db

        Rating existingRating = ratingRepository.findByUserIdAndMovieId(user.getId(), movieId)
                .orElseThrow(() -> new NotFoundException("No rating found for " + movieId + " in database"));

        ratingRepository.delete(existingRating);

    }

    // add rating
    @Transactional
    public void addRating(String username, Long tmdbId, Float ratingValue) {
        if (ratingValue < 1 || ratingValue > 10) {
            throw new IllegalArgumentException("Rating value must be between 1 and 10");
        }
        User user = userService.getUserByUsername(username); // retrieve user from db

        // retrieve movie from TMDB else convert to 'Movie' object and store to db
        Movie movie = movieService.getOrAddMovieToDb(tmdbId);

        // add new rating
        Rating rating = new Rating();

        rating.setUser(user);
        rating.setMovie(movie);
        rating.setRatingValue(ratingValue);
        ratingRepository.save(rating);
    }

    // update rating
    @Transactional
    public void updateRating(String username, Long movieId, Long ratingId, Float ratingValue) {
        if (ratingValue < 1 || ratingValue > 10) {
            throw new IllegalArgumentException("Rating value must be between 1 and 10");
        }
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new NotFoundException("No rating found for " + movieId + " in database"));
        rating.setRatingValue(ratingValue);
        // ratingRepository.save(rating);

    }

    // retrieve movie ratings by user
    public List<Rating> getRatingsByUser(String username) {
        User user = userService.getUserByUsername(username); // retrieve user from db

        return ratingRepository.findByUserId(user.getId());
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

    // retrieve movies rated by user
    public List<Movie> getRatedMoviesByUser(String username) {
        User user = userService.getUserByUsername(username);
        return user.getRatings().stream()
                .map(Rating::getMovie)
                .collect(Collectors.toList());
    }

}
