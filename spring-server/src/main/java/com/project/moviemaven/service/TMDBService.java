package com.project.moviemaven.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;

import com.project.moviemaven.exception.BadRequestException;
import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;

import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.Credits;
import info.movito.themoviedbapi.model.Discover;
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

    // tmdb genre id conversion for frontend request simplicity
    // https://developer.themoviedb.org/reference/genre-movie-list
    private static final Map<String, Integer> GENRE_MAPPING = Map.ofEntries( // immutable
            Map.entry("action", 28),
            Map.entry("adventure", 12),
            Map.entry("animation", 16),
            Map.entry("comedy", 35),
            Map.entry("crime", 80),
            Map.entry("documentary", 99),
            Map.entry("drama", 18),
            Map.entry("family", 10751),
            Map.entry("fantasy", 14),
            Map.entry("history", 36),
            Map.entry("horror", 27),
            Map.entry("music", 10402),
            Map.entry("mystery", 9648),
            Map.entry("romance", 10749),
            Map.entry("science fiction", 878),
            Map.entry("tv movie", 10770),
            Map.entry("thriller", 53),
            Map.entry("war", 10752),
            Map.entry("western", 37));

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

    @Cacheable(value = "moviesByFilter", key = "{#genre, #category, #page}")
    public List<MovieDb> getMoviesByFilter(String genre, String category, int page) {
        MovieResultsPage results;

        if (genre != null) {
            return getMoviesByGenre(genre, page);

        } else if (category != null) {
            switch (category.toLowerCase()) {
                case "popular":
                    results = tmdbApi.getMovies().getPopularMovies("en", page);
                    break;
                case "top_rated":
                    results = tmdbApi.getMovies().getTopRatedMovies("en", page);
                    break;
                case "now_playing":
                    results = tmdbApi.getMovies().getNowPlayingMovies("en", page, "us");
                    break;
                default:
                    throw new NotFoundException("Invalid category.");
            }
        } else {
            throw new BadRequestException("Either genre or category must be specified.");
        }

        if (results.getResults().isEmpty()) {
            throw new NotFoundException("No movies found for the given filter.");
        }

        return results.getResults();
    }

    // search for movie from TMDB
    @Cacheable(value = "searchMovie", key = "{#query, #page}")
    public Map<String, Object> searchMovie(String query, int page) {
        // Use tmdbApi to search for movies matching the query
        MovieResultsPage results = tmdbApi.getSearch().searchMovie(query, 0, "en", false, page);

        if (results.getResults().isEmpty()) {
            throw new NotFoundException("No movies found for the search query: " + query);
        }

        // create hashmap to return movies & also the total pages of the search results
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("movies", results.getResults());
        responseMap.put("totalPages", results.getTotalPages());

        return responseMap;

    }

    // movies by genre (helper)
    public List<MovieDb> getMoviesByGenre(String genreName, int page) {

        // retrieve genreId from GENRE_MAPPING
        Integer genreId = GENRE_MAPPING.get(genreName.toLowerCase());

        if (genreId == null) {
            throw new NotFoundException("Invalid genre name provided.");
        }

        Discover discover = new Discover()
                .withGenres(String.valueOf(genreId)) // popularity desc by default
                .page(page);

        MovieResultsPage results = tmdbApi.getDiscover().getDiscover(discover);

        if (results.getResults().isEmpty()) {
            throw new NotFoundException("No movies found for the specified genre.");
        }

        return results.getResults();
    }

}
