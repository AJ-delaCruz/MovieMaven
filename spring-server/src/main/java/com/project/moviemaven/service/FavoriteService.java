package com.project.moviemaven.service;

import java.util.Set;

import org.springframework.stereotype.Service;

import com.project.moviemaven.exception.BadRequestException;
import com.project.moviemaven.exception.NotFoundException;
// import com.project.moviemaven.model.Favorite;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.User;
// import com.project.moviemaven.repository.FavoriteRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    // private final FavoriteRepository favoriteRepository;
    private final UserService userService;
    private final MovieService movieService;

    // add movie to favorite
    @Transactional
    public void addFavorite(String username, Long tmdbId) {
        User user = userService.getUserByUsername(username); // retrieve user from db

        // retrieve movie from TMDB and/or convert to 'Movie' object and store to db
        Movie movie = movieService.getOrAddMovieToDb(tmdbId);

        if (!user.getFavorites().contains(movie)) {
            // Associate the movie to the user as a favorite
            user.getFavorites().add(movie);
            movie.getUserFavorites().add(user);
        } else {
            throw new BadRequestException(movie.getTitle() + " already exists in favorites");
        }

        // userRepository.save(user); //automatic Persistence with @Transactional
        // movieRepository.save(movie);
    }

    // remove favorite movie
    @Transactional
    public void removeFavorite(String username, Long tmdbId) {
        User user = userService.getUserByUsername(username);

        Movie movie = movieService.getMovieFromDb(tmdbId)
                .orElseThrow(() -> new NotFoundException("Movie not found in database"));

        // remove movie from favorite list
        if (user.getFavorites().contains(movie)) {

            user.getFavorites().remove(movie);
            movie.getUserFavorites().remove(user);
        } else {
            throw new NotFoundException(movie.getTitle() + " doesn't exist in favorites");
        }

        // userRepository.save(user);
        // movieRepository.save(movie);
    }

    // retrieve favorite movies of user
    @Transactional
    public Set<Movie> getFavorites(String username) {
        User user = userService.getUserByUsername(username);

        return user.getFavorites();
    }

}
