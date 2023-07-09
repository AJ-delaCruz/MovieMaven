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
        return new ArrayList<>(user.getWatchList()); // convert return Set<Movie> watchList to List

    }

    // remove movie from user's watch list
    public User removeFromWatchList(Long userId, Long tmdbId) {
        User user = userService.getUserById(userId); // retrieve user from db
        Movie movie = movieService.getMovieFromDb(tmdbId); // retrieve movie from db

        // remove Movie object from set else return false
        if (!user.getWatchList().remove(movie)) {
            throw new NotFoundException("Movie not found in the watchlist");
        }

        // Remove the user from the list of users who have the movie in their watchlist
        if (!movie.getUsers().remove(user)) {
            throw new NotFoundException("User not found in the movie's user list");
        }

        // update database
        userRepository.save(user);
        movieRepository.save(movie);
        return user;
    }
}
