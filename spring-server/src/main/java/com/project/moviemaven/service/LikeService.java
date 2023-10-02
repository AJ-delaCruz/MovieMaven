package com.project.moviemaven.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Like;
import com.project.moviemaven.model.Post;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.LikeRepository;
import com.project.moviemaven.repository.PostRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserService userService;

    @Transactional
    public void likePost(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found with ID: " + postId));
        User user = userService.getUserByUsername(username); // retrieve user from db

        // check if Post is already liked
        Optional<Like> existingLike = likeRepository.findByUserIdAndPostId(user.getId(), post.getId());

        if (existingLike.isPresent()) {
            throw new IllegalArgumentException("User has already liked this post");
        }

        // Create a new Like object
        Like like = new Like();

        like.setPost(post);
        like.setUser(user);
        likeRepository.save(like);

        // Update likesCount in the Post
        post.setLikesCount(post.getLikesCount() + 1);
        postRepository.save(post);
    }

    @Transactional
    public void unlikePost(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("No post found with ID: " + postId));
        User user = userService.getUserByUsername(username); // retrieve user from db

        // Find Like by user and post by IDs
        Like like = likeRepository.findByUserIdAndPostId(user.getId(), post.getId())
                .orElseThrow(() -> new NotFoundException("Like for Post not found for User"));

        // Delete Like from Post
        likeRepository.delete(like);

        // decrement likes for Post
        post.setLikesCount(post.getLikesCount() - 1);
        postRepository.save(post);
    }

    public List<Like> getLikesForPost(Long postId) {
        return likeRepository.findByPostId(postId)
                .orElseThrow(() -> new NotFoundException("No post found with ID: " + postId));
    }

}
