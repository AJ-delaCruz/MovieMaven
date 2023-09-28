package com.project.moviemaven.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.repository.MovieRepository;

@ExtendWith(MockitoExtension.class)
public class MovieServiceUnitTest {

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private TMDBService tmdbService;

    @InjectMocks
    private MovieService movieService;

    private Movie movie;

    @BeforeEach
    public void setUp() {
        movie = Movie.builder()
                .id(1L)
                .tmdbId(1L)
                .title("superman")
                .releaseDate("2005-06-15")
                .build();
    }

    @Test
    public void testAddMovie() {
        //mock
        when(tmdbService.getMovieAndConvert(1L)).thenReturn(movie);
        when(movieRepository.save(movie)).thenReturn(movie);

        //test
        Movie result = movieService.addMovie(1L);

        assertEquals(movie, result);
        assertEquals(movie.getId(), result.getId());
        assertEquals(movie.getTitle(), result.getTitle());
    }

    @Test
    public void testGetMovieFromDb() {
        when(movieRepository.findByTmdbId(1L)).thenReturn(Optional.of(movie));

        Optional<Movie> result = movieService.getMovieFromDb(1L);

        assertTrue(result.isPresent());
        assertEquals(movie, result.get()); //Optional.get()
    }

    @Test
    public void testGetOrAddMovieToDb_WhenMovieExists() {
        //test movie from DB
        when(movieRepository.findByTmdbId(1L)).thenReturn(Optional.of(movie));

        Movie result = movieService.getOrAddMovieToDb(1L);

        assertEquals(movie, result);
    }

    @Test
    public void testGetOrAddMovieToDb_WhenMovieDoesNotExist() {
        //test when movie doesn't exist in DB yet
        when(movieRepository.findByTmdbId(1L)).thenReturn(Optional.empty());

        //addMovie(tmdbId))
        when(tmdbService.getMovieAndConvert(1L)).thenReturn(movie);
        when(movieRepository.save(movie)).thenReturn(movie);

        Movie result = movieService.getOrAddMovieToDb(1L);

        assertEquals(movie, result);
    }

    @Test
    public void testDeleteMovie() {
        when(movieRepository.findByTmdbId(1L)).thenReturn(Optional.of(movie));

        assertDoesNotThrow(() -> movieService.deleteMovie(1L));
        verify(movieRepository).delete(movie);
    }

    @Test
    public void testDeleteMovie_WhenMovieNotFound() {
        //should throw exception when movie is not in DB
        when(movieRepository.findByTmdbId(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(NotFoundException.class, () -> movieService.deleteMovie(1L));
        assertEquals("No movie found with tmdb Id 1", exception.getMessage());
    }
}
