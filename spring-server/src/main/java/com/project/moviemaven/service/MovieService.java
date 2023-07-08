package com.project.moviemaven.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;
import com.project.moviemaven.repository.MovieRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieService {

    @Value("${TMDB_API_KEY}")
    private String TMDB_API_KEY;

    private final RestTemplate restTemplate;

    public Movie[] getMovies() {
        final String uri = "https://api.themoviedb.org/3/movie/now_playing?TMDB_API_KEY=" + TMDB_API_KEY;
        return restTemplate.getForObject(uri, Movie[].class);
    }

    public Movie getMovie(Long id) {
        final String uri = "https://api.themoviedb.org/3/movie/" + id + "?TMDB_API_KEY=" + TMDB_API_KEY;
        return restTemplate.getForObject(uri, Movie.class);
    }

    public Movie[] searchMovie(String query) {
        final String uri = "https://api.themoviedb.org/3/search/movie?TMDB_API_KEY=" + TMDB_API_KEY + "&query=" + query;
        return restTemplate.getForObject(uri, Movie[].class);
    }

    public String searchMovies(String query) {
        String url = "https://api.themoviedb.org/3/search/movie?TMDB_API_KEY=" + TMDB_API_KEY + "&query=" + query;
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
        return responseEntity.getBody();
    }
}
