package com.project.moviemaven.service;

import java.util.Set;

import org.springframework.stereotype.Service;

import com.project.moviemaven.exception.BadRequestException;
import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WatchListService {

    private final UserService userService;
    private final MovieService movieService;

    // add movie to user's watch list
    @Transactional
    public void addToWatchList(String username, Long tmdbId) {
        User user = userService.getUserByUsername(username); // retrieve user from db

        // retrieve movie from TMDB and/or convert to 'Movie' object and store to db
        Movie movie = movieService.getOrAddMovieToDb(tmdbId);

        // check if movie doesn't in User's watchList field
        if (!user.getWatchList().contains(movie)) {
            user.getWatchList().add(movie); // add movie to user's watchlist
            movie.getUserWatchlist().add(user); // add user to the list of users in the Movie
        } else {
            throw new BadRequestException(movie.getTitle() + " already exists in watch list");
        }

        // // note: automatic Persistence with @Transactional
        // userRepository.save(user); // save the changes to User
        // movieRepository.save(movie); // save the changes to Movie

    }

    // retrieve user's watchlist
    public Set<Movie> getWatchList(String username) {
        User user = userService.getUserByUsername(username);

        // movies from watch list
        return user.getWatchList();

    }

    // remove movie from user's watch list
    @Transactional
    public void removeFromWatchList(String username, Long tmdbId) {
        User user = userService.getUserByUsername(username);// retrieve user from db
        Movie movie = movieService.getMovieFromDb(tmdbId)// retrieve movie from db
                .orElseThrow(() -> new NotFoundException("Movie not found in database"));

        if (user.getWatchList().contains(movie)) {
            user.getWatchList().remove(movie);
            movie.getUserWatchlist().remove(user);
        } else {
            throw new NotFoundException(movie.getTitle() + " doesn't exist in watchlist");
        }

        // // update database
        // userRepository.save(user);
        // movieRepository.save(movie);
    }
}
