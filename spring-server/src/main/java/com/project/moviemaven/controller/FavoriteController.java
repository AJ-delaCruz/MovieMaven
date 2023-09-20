package com.project.moviemaven.controller;

import java.security.Principal;
import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.dto.MovieDTO;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.service.FavoriteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/favorite")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // Add a movie to user's favorites
    @PostMapping("/add/{tmdbId}")
    public ResponseEntity<String> addFavorite(Principal principal, @PathVariable Long tmdbId) {
        String username = principal.getName();
        favoriteService.addFavorite(username, tmdbId);
        return ResponseEntity.ok("TMDB Movie Id " + tmdbId + "  added to favorites successfully.");
    }

    // Get all favorite movies for user
    @GetMapping
    public ResponseEntity<List<MovieDTO>> getFavorites(Principal principal) {
        String username = principal.getName();
        List<MovieDTO> favorites = favoriteService.getFavorites(username);
        return ResponseEntity.ok(favorites);
    }

    // Remove a movie from user's favorites
    @DeleteMapping("/remove/{tmdbId}")
    public ResponseEntity<String> removeFavorite(Principal principal, @PathVariable Long tmdbId) {
        String username = principal.getName();

        favoriteService.removeFavorite(username, tmdbId);
        return ResponseEntity.ok("Movie " + tmdbId + " removed from favorites successfully.");
    }

}
