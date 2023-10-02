package com.project.moviemaven.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.dto.PostDTO;
import com.project.moviemaven.model.Post;
import com.project.moviemaven.service.PostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    // create post for movie
    @PostMapping("/movie/{tmdbId}")
    public ResponseEntity<String> createPost(Principal principal, @PathVariable Long tmdbId,
            @RequestBody PostDTO postDTO) {
        String username = principal.getName();
        postService.createPost(username, tmdbId, postDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Post created successfully.");
    }

    // fetch all posts related to a movie
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Post>> getAllPostsForMovie(@PathVariable Long movieId) {
        List<Post> posts = postService.getAllPostsForMovie(movieId);
        return ResponseEntity.ok(posts);
    }

    // Get a specific post
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    // Update a post
    @PutMapping("/{id}")
    public ResponseEntity<String> updatePost(@PathVariable Long id, @RequestBody PostDTO updatedPostDTO) {
        postService.updatePost(id, updatedPostDTO);

        return ResponseEntity.ok("Post updated successfully.");

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        postService.deletePost(id);

        return ResponseEntity.ok("Post deleted successfully.");
    }
}
