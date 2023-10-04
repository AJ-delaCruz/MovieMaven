package com.project.moviemaven.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.moviemaven.exception.BadRequestException;
import com.project.moviemaven.model.Like;
import com.project.moviemaven.model.Post;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.LikeRepository;
import com.project.moviemaven.repository.PostRepository;

@ExtendWith(MockitoExtension.class)
public class LikeServiceUnitTest {

    @Mock
    private LikeRepository likeRepository;

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private LikeService likeService;

    private Post post;
    private User user;
    private Like like;

    @BeforeEach
    public void setup() {
        user = new User();
        user.setId(1L);
        user.setUsername("testUser");

        post = new Post();
        post.setId(1L);
        post.setLikesCount(9);

        like = new Like();
        like.setId(2L);
        like.setUser(user);
        like.setPost(post);
    }

    @Test
    public void testLikePost() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(userService.getUserByUsername("testUser")).thenReturn(user);
        when(likeRepository.findByUserIdAndPostId(1L, 1L)).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> likeService.likePost(1L, "testUser"));
        verify(likeRepository).save(any(Like.class));
        assertEquals(10, post.getLikesCount()); //10 likes
    }

    @Test
    public void testLikePost_whenLikeAlreadyExists() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(userService.getUserByUsername("testUser")).thenReturn(user);
        when(likeRepository.findByUserIdAndPostId(1L, 1L)).thenReturn(Optional.of(like));

        assertThrows(BadRequestException.class, () -> likeService.likePost(1L, "testUser"));
    }

    @Test
    public void testUnlikePost() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(userService.getUserByUsername("testUser")).thenReturn(user);
        when(likeRepository.findByUserIdAndPostId(1L, 1L)).thenReturn(Optional.of(like));

        assertDoesNotThrow(() -> likeService.unlikePost(1L, "testUser"));
        verify(likeRepository).delete(like);
        assertEquals(8, post.getLikesCount()); // 8 likes
    }

    @Test
    public void testGetLikesForPost() {
        when(likeRepository.findByPostId(1L)).thenReturn(Optional.of(Arrays.asList(like)));

        List<Like> likes = likeService.getLikesForPost(1L);
        assertEquals(1, likes.size());
        assertEquals(like, likes.get(0));
    }
}
