package com.project.moviemaven.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.model.Like;
import com.project.moviemaven.service.LikeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/like/{postId}")
    public ResponseEntity<String> likePost(Principal principal, @PathVariable Long postId) {
        String username = principal.getName();
        likeService.likePost(postId, username);
        return ResponseEntity.ok("Post liked successfully.");
    }

    @DeleteMapping("/unlike/{postId}")
    public ResponseEntity<String> unlikePost(Principal principal, @PathVariable Long postId) {
        String username = principal.getName();
        likeService.unlikePost(postId, username);
        return ResponseEntity.ok("Post unliked successfully.");
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Like>> getLikesForPost(@PathVariable Long postId) {
        return ResponseEntity.ok(likeService.getLikesForPost(postId));
    }

}