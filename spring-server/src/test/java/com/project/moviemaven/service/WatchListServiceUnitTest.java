package com.project.moviemaven.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.Role;
import com.project.moviemaven.model.User;

@ExtendWith(MockitoExtension.class)
public class WatchListServiceUnitTest {

    @Mock
    UserService userService; // simulate the behavior

    @Mock
    MovieService movieService; // simulate the behavior

    @InjectMocks
    WatchListService watchListService;

    @BeforeEach
    public void setup() {
        //
    }

    @Test
    public void testAddWatchList() {
        // TODO
    }

    @Test
    public void testGetWatchList() {
        Long userId = 1L;
        Long movieId = 2L;
        Long movieId2 = 3L;

        Set<User> users = new HashSet<>();

        Movie movie1 = new Movie(1L, movieId, "superman", "2005-06-15", users);
        Movie movie2 = new Movie(2L, movieId2, "batman", "2008-07-18", users);

        Set<Movie> watchList = new HashSet<>();
        watchList.add(movie1);
        watchList.add(movie2);

        User user = new User(userId, "username", "password", watchList, Role.ROLE_USER);

        // mock the behavior of userService and movieService
        when(userService.getUserById(userId)).thenReturn(user);
        when(movieService.getMovieFromDb(movieId)).thenReturn(movie1);
        when(movieService.getMovieFromDb(movieId2)).thenReturn(movie2);

        List<Movie> movieList = watchListService.getWatchList(user.getId());
        assertEquals(movieList.size(), 2);
        assertEquals(movieList.get(0).getTitle(), "superman");
        assertEquals(movieList.get(1).getTitle(), "batman");

    }
}
