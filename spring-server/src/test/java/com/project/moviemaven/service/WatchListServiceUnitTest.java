package com.project.moviemaven.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.moviemaven.dto.MovieDTO;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.MovieRepository;
import com.project.moviemaven.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class WatchListServiceUnitTest {

    @Mock
    private UserService userService; // simulate the behavior

    @Mock
    private MovieService movieService; // simulate the behavior

    @Mock
    private UserRepository userRepository;

    @Mock
    private MovieRepository movieRepository;

    @InjectMocks
    private WatchListService watchListService;

    private User user;
    private Movie movie1;
    private Movie movie2;

    // helper
    private Movie createMovie(Long tmdbId, String title, String releaseDate) {
        return Movie.builder()
                .id(tmdbId)
                .tmdbId(tmdbId)
                .title(title)
                .releaseDate(releaseDate)
                .build();
    }

    @BeforeEach
    public void setup() {
        user = User.builder()
                .id(1L)
                .username("username")
                .password("password")
                .build();

        movie1 = createMovie(1L, "superman", "2005-06-15");
        movie2 = createMovie(2L, "batman", "2008-07-18");

    }

    @Test
    public void testAddWatchList() {
        Long tmdbId = 1L;

        // mock the behavior of userService and movieService
        when(userService.getUserByUsername("username")).thenReturn(user);
        when(movieService.getOrAddMovieToDb(tmdbId)).thenReturn(movie1);

        // test
        watchListService.addToWatchList("username", tmdbId);

        assertTrue(user.getWatchList().contains(movie1));
        assertTrue(movie1.getUserWatchlist().contains(user));

        verify(userRepository).save(any(User.class));
        verify(movieRepository).save(any(Movie.class));
    }

    @Test
    public void testGetWatchList() {
        String username = "username";

        user.getWatchList().add(movie1);
        user.getWatchList().add(movie2);

        // mock
        when(userService.getUserByUsername(username)).thenReturn(user);

        // test
        List<MovieDTO> movieDTOList = watchListService.getWatchList(username);

        assertEquals(movieDTOList.size(), 2);
        assertEquals(movieDTOList.get(0).getTitle(), "superman");
        assertEquals(movieDTOList.get(1).getTitle(), "batman");
    }

    @Test
    public void testRemoveFromWatchList() {
        String username = "username";
        Long tmdbId = 200L;

        user.getWatchList().add(movie1);
        movie1.getUserWatchlist().add(user); // Since it's bi-directional with Movie

        // mock
        when(userService.getUserByUsername(username)).thenReturn(user);
        when(movieRepository.findByTmdbId(tmdbId)).thenReturn(Optional.of(movie1));

        // test
        watchListService.removeFromWatchList(username, tmdbId);

        assertFalse(user.getWatchList().contains(movie1));
        assertFalse(movie1.getUserWatchlist().contains(user));
    }

}
