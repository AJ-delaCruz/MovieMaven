package com.project.moviemaven.service;

import java.util.List;
// import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.moviemaven.dto.MovieDTO;
import com.project.moviemaven.dto.MovieMapper;
import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.Rating;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.MovieRepository;
import com.project.moviemaven.repository.RatingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserService userService;
    private final MovieService movieService;
    private final MovieRepository movieRepository;

    // add or update rating
    @Transactional
    @CacheEvict(value = "userRatings", key = "#username")
    public void addOrUpdateRating(String username, Long tmdbId, Float ratingValue) {
        if (ratingValue < 1 || ratingValue > 10) {
            throw new IllegalArgumentException("Rating value must be between 1 and 10");
        }
        User user = userService.getUserByUsername(username); // retrieve user from db

        // retrieve movie from TMDB else convert to 'Movie' object and store to db
        Movie movie = movieService.getOrAddMovieToDb(tmdbId);

        // check if it's already rated
        Rating rating = ratingRepository.findByUserIdAndMovieId(user.getId(),
                movie.getId()) // local movie id
                .orElse(new Rating());

        rating.setUser(user);
        rating.setMovie(movie);
        rating.setRatingValue(ratingValue);
        ratingRepository.save(rating);
    }

    // delete rating for specific movie
    @Transactional
    @CacheEvict(value = "userRatings", key = "#username")
    public void removeRating(String username, Long tmdbId) {
        User user = userService.getUserByUsername(username); // retrieve user from db

        Movie movie = movieRepository.findByTmdbId(tmdbId) // retrieve movie using tmdb ID to get Movie ID
                .orElseThrow(() -> new NotFoundException("No movie found with TMDB ID: " + tmdbId));

        Rating existingRating = ratingRepository.findByUserIdAndMovieId(user.getId(), movie.getId())
                .orElseThrow(() -> new NotFoundException("No rating found for " + tmdbId + " in database"));

        ratingRepository.delete(existingRating);

    }

    // retrieve movies with user ratings
    @Transactional(readOnly = true)
    @Cacheable(value = "userRatings", key = "#username")
    public List<MovieDTO> getRatingsWithMoviesByUser(String username) {

        // Fetch ratings by user along with the associated movie using username
        List<Rating> ratings = ratingRepository.findRatedMoviesByUsername(username)
                .orElseThrow(() -> new NotFoundException("No rated movies found by user"));

        // Convert to Movie DTO with user rating
        return ratings.stream()
                .map(rating -> {
                    MovieDTO dto = MovieMapper.toMovieDTO(rating.getMovie());
                    dto.setUserRating(rating.getRatingValue());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /*
     * Unused, saved for future
     */
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

    // retrieve movie & user objects with rating by user
    public List<Rating> getRatingsByUser(String username) {
        User user = userService.getUserByUsername(username); // retrieve user from db

        return ratingRepository.findByUserId(user.getId());
    }

    // retrieve all ratings for movie from all users
    public List<Rating> getRatingsForMovie(Long movieId) { // TODO display individual user ratings w/ review?
        return ratingRepository.findByMovieId(movieId);
    }

    // TODO
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
    @Transactional(readOnly = true)
    public List<MovieDTO> getRatedMoviesByUser(String username) {
        User user = userService.getUserByUsername(username);
        // retrieve movies
        List<Movie> ratedMovies = user.getRatings().stream()
                .map(Rating::getMovie)
                .collect(Collectors.toList());

        // return needed movie data
        return ratedMovies.stream()
                .map(movie -> MovieMapper.toMovieDTO(movie))
                .collect(Collectors.toList());
    }

}

// //todo
// @Transactional
// @CacheEvict(value = "userRatings", key = "#username")
// public void addOrUpdateRating(String username, Long tmdbId, Float
// ratingValue) {
// if (ratingValue < 1 || ratingValue > 10) {
// throw new IllegalArgumentException("Rating value must be between 1 and 10");
// }

// //optimized database call
// Optional<Rating> currentRating =
// ratingRepository.findRatingByUsernameAndTmdbId(username, tmdbId);

// // update movie rating by user using optimized database call
// if (currentRating.isPresent()) {
// Rating existingRating = currentRating.get();
// existingRating.setRatingValue(ratingValue);
// ratingRepository.save(existingRating);
// } // add new rating for movie
// else {
// User user = userService.getUserByUsername(username);
// Movie movie = movieService.getOrAddMovieToDb(tmdbId);

// Rating newRating = new Rating();
// newRating.setUser(user);
// newRating.setMovie(movie);
// newRating.setRatingValue(ratingValue);
// ratingRepository.save(newRating);
// }
// }
