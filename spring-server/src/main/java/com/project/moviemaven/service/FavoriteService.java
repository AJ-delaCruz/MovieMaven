package com.project.moviemaven.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Favorite;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.FavoriteRepository;
import com.project.moviemaven.repository.MovieRepository;
import com.project.moviemaven.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final MovieService movieService;

    public List<Favorite> getFavoritesByUser(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    // add movie to favorite
    @Transactional
    public void addFavorite(Long userId, Long tmdbId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found in database"));

        // Check if movie exists in the 'Movie' postgres table
        Movie movie = movieRepository.findByTmdbId(tmdbId).orElse(null);

        // if not, add to db
        if (movie == null) {
            // retrieve movie from TMDB, convert to 'Movie' object, and store to db
            movie = movieService.addMovie(tmdbId);
        }

        Favorite favorite = new Favorite();

        favorite.setUser(user);
        favorite.setMovie(movie);
        favorite.setDate(LocalDateTime.now());

        favoriteRepository.save(favorite);
    }

    public void removeFavorite(Long userId, Long movieId) {
        Favorite existingFavorite = favoriteRepository.findByUserIdAndMovieId(userId, movieId)
                .orElseThrow(() -> new NotFoundException("No favorite movies found for this user"));

        favoriteRepository.delete(existingFavorite);
    }

}
