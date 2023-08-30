package com.project.moviemaven.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;

import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TMDBService {

    @Value("${TMDB_API_KEY}")
    private String TMDB_API_KEY;
    private TmdbApi tmdbApi;

    @PostConstruct
    public void initialize() {
        // initialize tmdbApi object using API key
        tmdbApi = new TmdbApi(TMDB_API_KEY);
    }

    // retrieve movie from TMDB & converts to Movie object
    public Movie getMovie(Long id) {

        // use tmdbApi to fetch movie details from TMDB
        MovieDb movieDb = tmdbApi.getMovies().getMovie(id.intValue(), "en"); // convert long to int
        // MovieMethod.values()); //fetch movie details from tmdb
        // MovieMethod.reviews, MovieMethod.latest, MovieMethod.images);

        if (movieDb == null) {
            throw new NotFoundException("Movie not found");
        }
        // System.out.println("MOVIE ID " + movieDb.getId());

        // convert to TMDB Movie to own Movie object
        return convertTMDBMovieToMovie(movieDb);
    }

    // helper
    // convert from MovieDb object to own Movie object
    private Movie convertTMDBMovieToMovie(MovieDb movieDb) {
        Movie movie = new Movie();
        movie.setTmdbId((long) movieDb.getId()); // movie Id with MovieDb's ID
        movie.setTitle(movieDb.getTitle());
        movie.setReleaseDate(movieDb.getReleaseDate());

        // return Movie object
        return movie;
    }

    // retrieve raw movie details from TMDB
    public MovieDb getTmdbMovie(Long id) {
        // use tmdbApi to fetch movie details from TMDB
        return tmdbApi.getMovies().getMovie(id.intValue(), "en"); // convert long to int

    }

    // retrieve current movies playing from TMDB
    public List<MovieDb> getMovies() {
        // Use tmdbApi to fetch currently playing movies
        MovieResultsPage results = tmdbApi.getMovies().getNowPlayingMovies("en", 1, "us");

        if (results.getResults().isEmpty()) {
            throw new NotFoundException("No movies found currently playing.");
        }

        return results.getResults();

    }

    // search for movie from TMDB
    public List<MovieDb> searchMovie(String query) {
        // Use tmdbApi to search for movies matching the query
        MovieResultsPage results = tmdbApi.getSearch().searchMovie(query, 0, "en", true, 1);

        if (results.getResults().isEmpty()) {
            throw new NotFoundException("No movies found for the search query: " + query);
        }
        return results.getResults();

    }

}
