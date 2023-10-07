package com.project.moviemaven.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.moviemaven.dto.MovieDTO;
import com.project.moviemaven.dto.MovieMapper;
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

    private final UserService userService;
    private final MovieService movieService;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    // add movie to user's watch list
    @Transactional
    @CacheEvict(value = "watchlist", key = "#username")
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

        // note: automatic Persistence with @Transactional
        userRepository.save(user); // save the changes to User
        movieRepository.save(movie); // save the changes to Movie

    }

    // retrieve user's watchlist
    @Transactional
    @Cacheable(value = "watchlist", key = "#username")
    public List<MovieDTO> getWatchList(String username) {
        List<Movie> watchlistMovies = userRepository.findWatchListByUsername(username)
                .orElseThrow(() -> new NotFoundException("Watchlist not found in database"));
        return watchlistMovies.stream()
                .map(MovieMapper::toMovieDTO)
                .collect(Collectors.toList());
    }

    // remove movie from user's watch list
    @Transactional
    @CacheEvict(value = "watchlist", key = "#username")
    public void removeFromWatchList(String username, Long tmdbId) {
        User user = userService.getUserByUsername(username);// retrieve user from db
        Movie movie = movieRepository.findByTmdbId(tmdbId)// retrieve movie from db
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
