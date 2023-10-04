package com.project.moviemaven.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.moviemaven.dto.PostDTO;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.Post;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.LikeRepository;
import com.project.moviemaven.repository.PostRepository;
import com.project.moviemaven.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class PostServiceUnitTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserService userService;

    @Mock
    private MovieService movieService;

    @Mock
    private LikeRepository likeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PostService postService;

    private User user;
    private Movie movie;
    private Post post;

    @BeforeEach
    public void setup() {
        user = User.builder()
                .id(1L)
                .username("username")
                .build();

        movie = Movie.builder()
                .id(1L)
                .tmdbId(100L)
                .title("batman")
                .build();

        post = Post.builder()
                .id(1L)
                .movie(movie)
                .user(user)
                .text("test post")
                .build();
    }

    @Test
    public void testCreatePost() {
        // mock the behavior of userService and movieService
        when(userService.getUserByUsername("username")).thenReturn(user);
        when(movieService.getOrAddMovieToDb(100L)).thenReturn(movie);
        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostDTO postDTO = postService.createPost("username", 100L, new PostDTO());
        assertEquals("test post", postDTO.getText());
    }

    @Test
    public void testGetAllPostsForMovie() {
        //mock repositories
    when(postRepository.findByMovie_TmdbId(100L)).thenReturn(Optional.of(Arrays.asList(post)));
    when(userRepository.findIdByUsername("username")).thenReturn(Optional.of(1L)); 
    when(likeRepository.findPostIdsByUserIdAndMovieId(any(Long.class), any(Long.class)))
        .thenReturn(new HashSet<>(Arrays.asList(1L))); 

        //test
    List<PostDTO> postDTOs = postService.getAllPostsForMovie(100L, "username");

    assertEquals(1, postDTOs.size());
    assertEquals("test post", postDTOs.get(0).getText());
    assertTrue(postDTOs.get(0).getIsLikedByUser()); // verifying that the post is liked by the user
    }

    @Test
    public void testUpdatePost() {
        //mock
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(post); //returns the updated post after saving it
        PostDTO updatedPostDTO = new PostDTO();
        updatedPostDTO.setText("Updated post");
    
        ArgumentCaptor<Post> postCaptor = ArgumentCaptor.forClass(Post.class);
    
        //test
        Post updatedPost = postService.updatePost(1L, updatedPostDTO);
    
        verify(postRepository).save(postCaptor.capture());
        Post capturedPost = postCaptor.getValue();
        assertEquals("Updated post", capturedPost.getText());
        assertEquals("Updated post", updatedPost.getText());
    }

    @Test
    public void testDeletePost() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        assertDoesNotThrow(() -> postService.deletePost(1L));
        verify(postRepository).delete(post);
    }

    @Test
    public void testGetPostById() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        
        Post fetchedPost = postService.getPostById(1L);
        assertEquals("test post", fetchedPost.getText());
    }
}
