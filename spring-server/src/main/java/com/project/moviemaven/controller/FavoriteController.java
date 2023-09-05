package com.project.moviemaven.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.model.Favorite;
import com.project.moviemaven.service.FavoriteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/favorite")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // Add a movie to user's favorites
    @PostMapping("/add")
    public ResponseEntity<String> addFavorite(@RequestParam Long userId, @RequestParam Long tmdbId) {
        favoriteService.addFavorite(userId, tmdbId);
        return ResponseEntity.ok("TMDB Movie Id " + tmdbId + "  added to favorites successfully.");
    }

    // Remove a movie from user's favorites
    @DeleteMapping("/remove//{movieId}")
    public ResponseEntity<String> removeFavorite(@RequestParam Long userId, @PathVariable Long movieId) {
        favoriteService.removeFavorite(userId, movieId);
        return ResponseEntity.ok("Movie " + movieId + " removed from favorites successfully.");
    }

    // Get all favorite movies for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Favorite>> getFavoritesByUser(@PathVariable Long userId) {
        List<Favorite> favorites = favoriteService.getFavoritesByUser(userId);
        return ResponseEntity.ok(favorites);
    }
}
