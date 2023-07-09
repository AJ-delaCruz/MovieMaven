package com.project.moviemaven.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.moviemaven.exception.BadRequestException;
import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.MovieRepository;
import com.project.moviemaven.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WatchListService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final UserService userService;
    private final MovieService movieService;

    // add movie to user's watch list
    public User addToWatchList(Long userId, Long tmdbId) {

        // get movie from DB else store it
        Movie movie = movieService.addMovie(tmdbId);
        // retrieve user
        User user = userService.getUserById(userId);

        // check if movie doesn't in User's watchList field
        if (!user.getWatchList().contains(movie)) {
            user.getWatchList().add(movie); // add movie to user's watchlist
            movie.getUsers().add(user); // add user to the list of users in the Movie
        } else {
            throw new BadRequestException(movie.getTitle() + " already exists in watch list");
        }
        
        userRepository.save(user); // save the changes to the HashSet User
        movieRepository.save(movie); // save the changes to the HashSet Movie
        return user;

    }

    // retrieve user's watchlist
    public List<Movie> getWatchList(Long userId) {
        User user = userService.getUserById(userId); // find user
        List<Movie> movies = new ArrayList<>();
        for (Long movieId : user.getWatchList()) { // for every movie Id, return the movie
            movies.add(movieService.getMovie(movieId)); // retrieve movies from tmdb
        }
        return movies;
    }

    // remove movie from user's watch list
    public User removeFromWatchList(Long userId, Long movieId) {
        User user = userService.getUserById(userId);

        if (!user.getWatchList().remove(movieId)) {
            throw new NotFoundException("Movie not found");
        }

        return userRepository.save(user);
    }
}
