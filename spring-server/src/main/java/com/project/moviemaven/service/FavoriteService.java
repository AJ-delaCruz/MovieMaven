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
// import com.project.moviemaven.model.Favorite;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.User;
// import com.project.moviemaven.repository.FavoriteRepository;
import com.project.moviemaven.repository.MovieRepository;
import com.project.moviemaven.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    // private final FavoriteRepository favoriteRepository;
    private final UserService userService;
    private final MovieService movieService;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    // add movie to favorite
    @Transactional
    @CacheEvict(value = "favorite", key = "#username")
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

        userRepository.save(user); // automatic Persistence with @Transactional
        movieRepository.save(movie);
    }

    // remove favorite movie
    @Transactional
    @CacheEvict(value = "favorite", key = "#username")
    public void removeFavorite(String username, Long tmdbId) {
        User user = userService.getUserByUsername(username);

        Movie movie = movieRepository.findByTmdbId(tmdbId)
                .orElseThrow(() -> new NotFoundException("Movie not found in database"));

        // remove movie from favorite list
        if (user.getFavorites().contains(movie)) {

            user.getFavorites().remove(movie);
            movie.getUserFavorites().remove(user);
        } else {
            throw new NotFoundException(movie.getTitle() + " doesn't exist in favorites");
        }

        userRepository.save(user);
        movieRepository.save(movie);
    }

    // retrieve favorite movies of user
    @Transactional(readOnly = true)
    @Cacheable(value = "favorite", key = "#username")
    public List<MovieDTO> getFavorites(String username) {
        List<Movie> favoriteMovies = userRepository.findFavoriteMoviesByUsername(username)
                .orElseThrow(() -> new NotFoundException("Favorite Movies not found in database"));
        return favoriteMovies.stream()
                .map(movie -> MovieMapper.toMovieDTO(movie))
                .collect(Collectors.toList());
    }

}
