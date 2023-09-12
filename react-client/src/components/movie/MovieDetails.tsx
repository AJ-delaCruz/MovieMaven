import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../../utils/config';
import { MovieType } from '../../types/movie';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';

const MovieDetails: React.FC = () => {
    const [movie, setMovie] = useState<MovieType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { tmdbId } = useParams<{ tmdbId: string }>();
    // const location = useLocation();
    // console.log(location.pathname);

    useEffect(() => {
        const getMovieDetails = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/tmdb/movie/${tmdbId}`);
                // console.log('RESPONSE');
                // console.log(response.data);
                setMovie(response.data);


            } catch (err) {
                console.error('Failed to fetch movie details:', err);
                setError('Failed to fetch movie details. Please try again.');

            }
        };

        getMovieDetails();
    }, [tmdbId]);

    if (error) return <p>{error}</p>;

    if (!movie) return <CircularProgress />;

    return (

        <div className="movie-details">
            <h1>{movie.title}</h1>
            {
                movie.poster_path
                    ? <img className="movie-poster" src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`} loading="lazy" alt={movie.title} />
                    : <h3>No Image Available</h3>
            }
            {movie.tagline && <p><em>{movie.tagline}</em></p>}
            <p><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', })}</p>
            <p><strong>Description:</strong> {movie.overview}</p>
            <p><strong>Audience Score:</strong> {movie.vote_average} ({movie.vote_count} votes)</p>
            {movie.certification && <p><strong>Content Rating:</strong> {movie.certification}</p>}
            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
            {/* {movie.genres && <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>} */}
            {movie.genres && <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>}
            {/* {movie.spoken_languages && <p><strong>Languages:</strong> {movie.spoken_languages.map(lang => lang.name).join(', ')}</p>} */}
            {movie.spoken_languages && <p><strong>Languages:</strong> {movie.spoken_languages.join(', ')}</p>}

            {movie.actors && <p><strong>Cast:</strong> {movie.actors.join(', ')}</p>}
            {movie.directors && <p><strong>Director:</strong> {movie.directors.join(', ')}</p>}

        </div>
    );
}

export default MovieDetails;
