package com.project.moviemaven.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.moviemaven.dto.MovieDTO;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.Rating;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.MovieRepository;
import com.project.moviemaven.repository.RatingRepository;

@ExtendWith(MockitoExtension.class)
public class RatingServiceUnitTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private UserService userService;

    @Mock
    private MovieService movieService;

    @Mock
    private MovieRepository movieRepository;

    @InjectMocks
    private RatingService ratingService;

    private User user;
    private Movie movie;
    private Movie movie2;
    private Rating rating;

    // helper
    private Movie createMovie(Long id, Long tmdbId, String title, String releaseDate) {
        return Movie.builder()
                .id(id)
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
                .build();

        movie = createMovie(1L, 100L, "batman", "2008-07-18");
        movie2 = createMovie(2L, 200L, "superman", "2005-06-15");

        rating = Rating.builder()
                .id(1L)
                .user(user)
                .movie(movie)
                .ratingValue(5.0f)
                .build();
    }

    @Test
    public void testAddOrUpdateRating_AddingNewRating() {
        // mock
        when(userService.getUserByUsername("username")).thenReturn(user);
        when(movieService.getOrAddMovieToDb(100L)).thenReturn(movie);
        // empty rating
        when(ratingRepository.findByUserIdAndMovieId(1L, 1L)).thenReturn(Optional.empty());

        //test
        ratingService.addOrUpdateRating("username", 100L, 9.0f);

        ArgumentCaptor<Rating> newRating = ArgumentCaptor.forClass(Rating.class);

        //check new rating
        verify(ratingRepository).save(newRating.capture());
        assertEquals(9.0f, newRating.getValue().getRatingValue());
        assertEquals(100L, newRating.getValue().getMovie().getTmdbId());

    }

    @Test
    public void testAddOrUpdateRating_UpdatingExistingRating() {
        //mock
        when(userService.getUserByUsername("username")).thenReturn(user);
        when(movieService.getOrAddMovieToDb(100L)).thenReturn(movie);
        when(ratingRepository.findByUserIdAndMovieId(1L, 1L)).thenReturn(Optional.of(rating));

        ratingService.addOrUpdateRating("username", 100L, 7.0f);

        assertEquals(7.0f, rating.getRatingValue());
        verify(ratingRepository).save(any(Rating.class));
    }

    @Test
    public void testRemoveRating() {

        //mock
        when(userService.getUserByUsername("username")).thenReturn(user);
        when(movieRepository.findByTmdbId(100L)).thenReturn(Optional.of(movie));
        when(ratingRepository.findByUserIdAndMovieId(1L, 1L)).thenReturn(Optional.of(rating));

        ratingService.removeRating("username", 100L);

        verify(ratingRepository).delete(rating);
    }

    @Test
    public void testGetRatingsWithMoviesByUser() {
        Rating rating2 = Rating.builder()
                .id(2L)
                .user(user)
                .movie(movie2)
                .ratingValue(8.0f)
                .build();

        List<Rating> ratings = Arrays.asList(rating, rating2);
        // mock
        when(userService.getUserByUsername("username")).thenReturn(user);
        when(ratingRepository.findByUserId(1L)).thenReturn(ratings);

        List<MovieDTO> movieDTOs = ratingService.getRatingsWithMoviesByUser("username");

        assertEquals(2, movieDTOs.size());
        assertEquals(5.0f, movieDTOs.get(0).getUserRating());
        assertEquals("batman", movieDTOs.get(0).getTitle());
        assertEquals(8.0f, movieDTOs.get(1).getUserRating());
        assertEquals("superman", movieDTOs.get(1).getTitle());

    }

}
