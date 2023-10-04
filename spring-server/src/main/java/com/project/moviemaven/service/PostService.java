package com.project.moviemaven.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.moviemaven.dto.PostDTO;
import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.Post;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.LikeRepository;
import com.project.moviemaven.repository.PostRepository;
import com.project.moviemaven.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MovieService movieService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;

    // create and return the post as post DTO
    @Transactional
    public PostDTO createPost(String username, Long tmdbId, PostDTO postDTO) {
        User user = userService.getUserByUsername(username); // retrieve user from db

        // retrieve movie from TMDB and/or convert to 'Movie' object and store to db
        Movie movie = movieService.getOrAddMovieToDb(tmdbId);

        Post post = new Post();
        post.setMovie(movie);
        post.setUser(user);
        post.setText(postDTO.getText());

        post = postRepository.save(post); // Save the new post to the database

        return PostDTO.toDTO(post, username, false); // Convert the saved Post entity to DTO format

    }

    public List<PostDTO> getAllPostsForMovie(Long tmdbId, String username) {
        List<Post> posts = postRepository.findByMovie_TmdbId(tmdbId) // use tmdb id instead of movie id
                .orElseThrow(() -> new NotFoundException("No posts found with movie Id " + tmdbId));

        // get current user id
        Long userId = userRepository.findIdByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found with username: " + username));

        // fetch all the posts liked by the current user
        Set<Long> likedPostIds = likeRepository.findPostIdsByUserIdAndMovieId(userId, tmdbId);

        return posts.stream()
                // .map(post -> PostDTO.toDTO(post, username))
                .map(post -> PostDTO.toDTO(post, username,
                        likedPostIds.contains(post.getId()))) // check if post is liked by user
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
