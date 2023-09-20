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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.dto.MovieDTO;
import com.project.moviemaven.service.WatchListService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user/watchlist")
@RequiredArgsConstructor
public class WatchListController {

    private final WatchListService watchListService;

    // add movie to watchlist
    @PostMapping("/add")
    public ResponseEntity<String> addToWatchList(Principal principal, @RequestParam Long tmdbId) {
        String username = principal.getName();
        watchListService.addToWatchList(username, tmdbId);
        return ResponseEntity.ok("TMDB Movie Id " + tmdbId + "  added to watchlist successfully.");

    }

    // retrieve user's watchlist
    @GetMapping
    public ResponseEntity<List<MovieDTO>> getWatchlist(Principal principal) {
        String username = principal.getName();
        List<MovieDTO> movies = watchListService.getWatchList(username);
        return ResponseEntity.ok(movies);
    }

    // remove movie from user's watchlist
    @DeleteMapping("/remove/{tmdbId}")
    public ResponseEntity<String> removeFromWatchList(Principal principal, @PathVariable Long tmdbId) {
        String username = principal.getName();
        watchListService.removeFromWatchList(username, tmdbId);
        return ResponseEntity.ok("Movie " + tmdbId + " removed from watchlist successfully.");

    }

}
