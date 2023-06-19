package com.project.moviemaven.service;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.moviemaven.exception.BadRequestException;
import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.UserRepository;

@Service
public class WatchListService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private MovieService movieService;

    // add movie to user's watch list
    public User addToWatchList(ObjectId userId, ObjectId movieId) {
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
    public List<Movie> getWatchList(ObjectId userId) {
        User user = userService.getUserById(userId); // find user
        List<Movie> movies = new ArrayList<>();
        for (ObjectId movieId : user.getWatchList()) { // for every movie Id, return the movie
            movies.add(movieService.getMovie(movieId));
        }
        return movies;
    }

    // remove movie from user's watch list
    public User removeFromWatchList(ObjectId userId, ObjectId movieId) {
        User user = userService.getUserById(userId);

        if (!user.getWatchList().remove(movieId)) {
            throw new NotFoundException("Movie not found");
        }

        return userRepository.save(user);
    }

}
