package com.project.moviemaven.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.moviemaven.model.Movie;
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
        //TODO
    }

    @Test
    public void testGetWatchList() {
        ObjectId userId = new ObjectId();
        ObjectId movieId = new ObjectId();
        ObjectId movieId2 = new ObjectId();

        Movie movie1 = new Movie(movieId, "superman", null, null);
        Movie movie2 = new Movie(movieId2, "batman", null, null);
        ArrayList<ObjectId> watchList = new ArrayList<>();
        watchList.add(movieId);
        watchList.add(movieId2);
        User user = new User(userId, null, null, watchList, null);

        // mock the behavior of userService and movieService
        when(userService.getUserById(userId)).thenReturn(user);
        when(movieService.getMovie(movieId)).thenReturn(movie1);
        when(movieService.getMovie(movieId2)).thenReturn(movie2);

        List<Movie> movieList = watchListService.getWatchList(user.getId());
        assertEquals(movieList.size(), 2);
        assertEquals(movieList.get(0).getTitle(), "superman");
        assertEquals(movieList.get(1).getTitle(), "batman");

    }
}
