package com.project.moviemaven.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;

import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;

import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.Credits;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.ReleaseInfo;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.model.people.PersonCrew;
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
    /**
     * Fetches movie details from TMDB by its ID, and converts it to a local Movie
     * entity
     *
     * @param tmdbId The ID of the movie in TMDB.
     * @return Converted Movie object.
     */
    @Cacheable(value = "movie", key = "#id")
    public Movie getMovieAndConvert(Long id) {

        // use tmdbApi to fetch movie details from TMDB
        MovieDb movieDb = tmdbApi.getMovies().getMovie(id.intValue(), "en"); // convert long to int
        // MovieMethod.reviews, MovieMethod.latest, MovieMethod.images);

        if (movieDb == null) {
            throw new NotFoundException("Movie not found");
        }

        // Fetch US Certification
        String usCertification = getUSCertificationForMovie(id);

        // Fetch actors and directors
        Set<String> actors = getActorsForMovie(id);
        Set<String> directors = getDirectorsForMovie(id);

        // convert to TMDB Movie to own Movie object
        return convertTMDBMovieToMovie(movieDb, usCertification, actors, directors);
    }

    // helper
    // convert from MovieDb object to own Movie object
    private Movie convertTMDBMovieToMovie(MovieDb movieDb, String usCertificate, Set<String> actors,
            Set<String> directors) {

        Movie movie = new Movie();
        movie.setTmdbId((long) movieDb.getId()); // movie Id with MovieDb's ID
        movie.setTitle(movieDb.getTitle());
        movie.setReleaseDate(movieDb.getReleaseDate());
        movie.setGenres(movieDb.getGenres() != null // check if genre is not null
                ? movieDb.getGenres().stream().map(x -> x.getName()).collect(Collectors.toList())
                : null);
        movie.setOverview(movieDb.getOverview());
        movie.setTagline(movieDb.getTagline());
        movie.setSpokenLanguages(movieDb.getSpokenLanguages() != null // check if lang is not null
                ? movieDb.getSpokenLanguages().stream().map(x -> x.getName()).collect(Collectors.toList())
                : null);
        movie.setPopularity(movieDb.getPopularity());
        movie.setVoteAverage(movieDb.getVoteAverage());
        movie.setVoteCount(movieDb.getVoteCount());
        movie.setRuntime(movieDb.getRuntime());
        movie.setPosterPath(movieDb.getPosterPath());
        movie.setBackdropPath(movieDb.getBackdropPath());

        movie.setCertification(usCertificate);
        movie.setActors(actors);
        movie.setDirectors(directors);

        // return converted 'Movie' object
        return movie;
    }

    // retrieve raw movie details from TMDB
    @Cacheable(value = "tmdbMovie", key = "#id")
    public MovieDb getTmdbMovie(Long id) {
        // use tmdbApi to fetch movie details from TMDB
        return tmdbApi.getMovies().getMovie(id.intValue(), "en"); // convert long to int

    }

    // get movie 'US' certification from TMDB (helper)
    public String getUSCertificationForMovie(Long id) {
        List<ReleaseInfo> releaseDate = tmdbApi.getMovies().getReleaseInfo(id.intValue(), "en");

        // private String getUSCertification(List<ReleaseInfo> releaseDate) {
        for (ReleaseInfo releaseInfo : releaseDate) {
            if ("US".equals(releaseInfo.getCountry())) { // return first index for certification
                if (!releaseInfo.getReleaseDates().isEmpty()) {
                    return releaseInfo.getReleaseDates().get(0).getCertification();
                }
            }
        }
        return null; // Return null or a default value if no US certification is found
    }

    // get the actors from tmdb (helper)
    private Set<String> getActorsForMovie(Long id) {
        Credits castMembers = tmdbApi.getMovies().getCredits(id.intValue());
        return castMembers.getCast().stream()
                .map(x -> x.getName()) // lambda
                .limit(10) // limit to 10 actors
                .collect(Collectors.toSet());
    }

    // get the director from tmdb(helper)
    private Set<String> getDirectorsForMovie(Long id) {
        Credits crewMembers = tmdbApi.getMovies().getCredits(id.intValue());
        return crewMembers.getCrew().stream()
                .filter(crew -> "Director".equals(crew.getJob()))
                .map(PersonCrew::getName) // method reference
                .collect(Collectors.toSet());
    }

    // retrieve the current movies playing in theater
    @Cacheable(value = "currentMovies", key = "#page")
    public List<MovieDb> getCurrentMovies(int page) {
        // Use tmdbApi to fetch currently playing movies
        MovieResultsPage results = tmdbApi.getMovies().getNowPlayingMovies("en", page, "us");

        if (results.getResults().isEmpty()) {
            throw new NotFoundException("No movies found currently playing.");
        }

        return results.getResults();

    }

    // search for movie from TMDB
    @Cacheable(value = "searchMovie", key = "{#query, #page}")
    public List<MovieDb> searchMovie(String query, int page) {
        // Use tmdbApi to search for movies matching the query
        MovieResultsPage results = tmdbApi.getSearch().searchMovie(query, 0, "en", true, page);

        if (results.getResults().isEmpty()) {
            throw new NotFoundException("No movies found for the search query: " + query);
        }
        return results.getResults();

    }

}
