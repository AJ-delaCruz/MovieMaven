import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.Movie;

import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbMovies.MovieMethod;
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

    // retrieve movie from TMDB
    public Movie getMovie(Long id) {
        // use tmdbApi to fetch movie details from TMDB
        MovieDb movieDb = tmdbApi.getMovies().getMovie(id.intValue(), "en", MovieMethod.values());
        if (movieDb == null) {
            throw new NotFoundException("Movie not found");
        }
        // convert to Movie object
        return covertTMDBMovieToMovie(movieDb);
    }

    // covert from MovieDb object to own Movie object
    private Movie covertTMDBMovieToMovie(MovieDb movieDb) {
        Movie movie = new Movie();
        movie.setMovieId((long) movieDb.getId());
        movie.setTitle(movieDb.getTitle());
        movie.setReleaseDate(movieDb.getReleaseDate());

        // return Movie object
        return movie;
    }

    // retrieve current movies playing from TMDB
    public List<Movie> getMovies() {
        // Use tmdbApi to fetch currently playing movies
        MovieResultsPage results = tmdbApi.getMovies().getNowPlayingMovies("en", 1, "us");
        return results.getResults().stream() // covert List of MovieDb objects to Stream
                .map(this::covertTMDBMovieToMovie) // convert MovieDb to Movie object
                .collect(Collectors.toList()); // covert Stream back to List of Movie object
    }

    // search for movie from TMDB
    public List<Movie> searchMovie(String query) {
        // Use tmdbApi to search for movies matching the query
        MovieResultsPage results = tmdbApi.getSearch().searchMovie(query, 0, "en", true, 1);
        // conver each MovieDb object to Movie object
        return results.getResults().stream()
                .map(this::covertTMDBMovieToMovie)
                .collect(Collectors.toList());
    }
}
