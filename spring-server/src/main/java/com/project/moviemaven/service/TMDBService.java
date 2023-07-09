package com.project.moviemaven.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TMDBService {

    @Value("${TMDB_API_KEY}")
    private String TMDB_API_KEY;
    private static final String TMDB_API_URL = "https://api.themoviedb.org/3";

    private final RestTemplate restTemplate;

    // retrieve movie from TMDB
    public Movie getMovie(Long id) {
        final String uri = TMDB_API_URL + "/movie/" + id + "?TMDB_API_KEY=" + TMDB_API_KEY;
        Movie movie = restTemplate.getForObject(uri, Movie.class);
        if (movie == null) {
            throw new NotFoundException("Movie not found");
        }
        return movie;
    }

    // retrieve current movies playing from TMDB
    public Movie[] getMovies() {
        final String uri = TMDB_API_URL + "/movie/now_playing?TMDB_API_KEY=" + TMDB_API_KEY;
        return restTemplate.getForObject(uri, Movie[].class);
    }

    // search for movie from TMDB
    public Movie[] searchMovie(String query) {
        final String uri = TMDB_API_URL + "/search/movie?TMDB_API_KEY=" + TMDB_API_KEY + "&query=" + query;
        return restTemplate.getForObject(uri, Movie[].class);
    }

    // retrieve movies from TMDB
    public String searchMovies(String query) {
        String url = TMDB_API_URL + "/search/movie?TMDB_API_KEY=" + TMDB_API_KEY + "&query=" + query;
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
        return responseEntity.getBody();
    }
}
