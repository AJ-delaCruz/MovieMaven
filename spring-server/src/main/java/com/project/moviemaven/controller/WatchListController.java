package com.project.moviemaven.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.User;
import com.project.moviemaven.service.WatchListService;

@RestController
@RequestMapping("/api/user/watchlist/{userId}")
@CrossOrigin("*")
public class WatchListController {

    private final WatchListService watchListService;

    public WatchListController(WatchListService watchListService) {
        this.watchListService = watchListService;
    }

    // add movie to watchlist
    @PostMapping("/{movieId}")
    public User addToWatchList(@PathVariable Long userId, @PathVariable Long movieId) {
        return watchListService.addToWatchList(userId, movieId);
    }

    // retrieve user's watchlist
    @GetMapping
    public List<Movie> getWatchlist(@PathVariable Long userId) {
        return watchListService.getWatchList(userId);
    }

    // remove movie from user's watchlist
    @DeleteMapping("/{movieId}")
    public User removeFromWatchList(@PathVariable Long userId, @PathVariable Long movieId) {
        return watchListService.removeFromWatchList(userId, movieId);
    }

}
