package com.project.moviemaven.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.moviemaven.dto.PostDTO;
import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.Post;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.MovieRepository;
import com.project.moviemaven.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MovieRepository movieRepository;
    private final UserService userService;

    @Transactional
    public Post createPost(String username, Long tmdbId, PostDTO postDTO) {
        User user = userService.getUserByUsername(username); // retrieve user from db

        Movie movie = movieRepository.findByTmdbId(tmdbId) // retrieve movie using tmdb ID to get Movie ID
                .orElseThrow(() -> new NotFoundException("No movie found with TMDB ID: " + tmdbId));

        Post post = new Post();
        post.setMovie(movie);
        post.setUser(user);
        post.setText(postDTO.getText());

        return postRepository.save(post);
    }

    public List<PostDTO> getAllPostsForMovie(Long tmdbId, String username) {
        List<Post> posts = postRepository.findByMovie_TmdbId(tmdbId) // use tmdb id instead of movie id
                .orElseThrow(() -> new NotFoundException("No posts found with movie Id " + tmdbId));

        return posts.stream()
                .map(post -> PostDTO.toDTO(post, username))
                .collect(Collectors.toList());
    }

    public Post updatePost(Long id, PostDTO postDTO) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No post found with Id " + id));
        existingPost.setText(postDTO.getText());
        return postRepository.save(existingPost);
    }

    public void deletePost(Long id) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No post found with Id " + id));
        postRepository.delete(existingPost);
    }

    // unused
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No post found with Id " + id));
    }

}
