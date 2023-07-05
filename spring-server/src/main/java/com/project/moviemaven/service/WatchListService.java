package com.project.moviemaven.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.moviemaven.exception.BadRequestException;
import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WatchListService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final MovieService movieService;

    // add movie to user's watch list
    public User addToWatchList(Long userId, Long movieId) {
        Movie movie = movieService.getMovie(movieId);

        // add the movie
        User user = userService.getUserById(userId);
        // check if movie exists already in User's watchList field
        if (user.getWatchList().contains(movieId)) {
            throw new BadRequestException(movie.getTitle() + " already exists in watch list");
        }
        user.getWatchList().add(movieId);

        return userRepository.save(user);
    }

    // retrieve user's watchlist
    public List<Movie> getWatchList(Long userId) {
        User user = userService.getUserById(userId); // find user
        List<Movie> movies = new ArrayList<>();
        for (Long movieId : user.getWatchList()) { // for every movie Id, return the movie
            movies.add(movieService.getMovie(movieId));
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
