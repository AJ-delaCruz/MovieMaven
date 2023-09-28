import { useParams } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../../utils/config';
import { MovieType } from '../../types/movie';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import './movie-details.scss';
import FavoriteButton from '../user/favorite/FavoriteButton';
import RatingButton from '../user/rating/RatingButton';
import WatchlistButton from '../user/watchlist/WatchlistButton';


const MovieDetails: React.FC = () => {
    const [movie, setMovie] = useState<MovieType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { tmdbId } = useParams<{ tmdbId: string }>();

    const [ratingAnchor, setRatingAnchor] = useState<null | HTMLElement>(null);
    const openRatingModal = (e: React.MouseEvent<HTMLElement>) => {
        setRatingAnchor(e.currentTarget);
    };

    const closeRatingModal = () => {
        setRatingAnchor(null);
    };
    // const location = useLocation();
    // console.log(location.pathname);

    useEffect(() => {
        const getMovieDetails = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/tmdb/movie/${tmdbId}`);

                const movieData = response.data;
                movieData.id = movieData.tmdb_id; //Convert tmdb_id to id. ID is null for movie details
                setMovie(movieData);
                // setMovie(response.data);
                console.log(movieData);

            } catch (err) {
                console.error('Failed to fetch movie details:', err);
                setError('Failed to fetch movie details. Please try again.');

            }
        };

        getMovieDetails();
    }, [tmdbId]);

    if (error) return <p>{error}</p>;

    if (!movie) {
        return <div
            className="loader-container">
            <CircularProgress />
        </div>;
    }

    return (
        <div className="movie-details">
            <h1>{movie.title}</h1>
            <div className="content">
                <div className="image-container">
                    {movie.poster_path
                        ? <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} loading="lazy" alt={movie.title} />
                        : <h3>No Image Available</h3>}
                </div>
                <div className="details-container">
                    {movie.tagline && <p className="tagline"><em>{movie.tagline}</em></p>}


                    <div style={{ display: 'flex', margin: '15px 5px' }}>
                        <div style={{ marginRight: '30px' }}>
                            <FavoriteButton movie={movie} />
                        </div>
                        <div style={{ marginRight: '30px' }}>
                            <WatchlistButton movie={movie} />
                        </div>
                        <div>
                            <RatingButton
                                movie={movie}
                                isRatingPopoverOpen={Boolean(ratingAnchor)}
                                ratingAnchorEl={ratingAnchor}
                                onRatingPopoverClose={closeRatingModal}
                                onRatingPopoverOpen={openRatingModal}
                            />
                        </div>

                    </div>

                    <p><strong className="description-label">Description:</strong></p>
                    <p className="description">{movie.overview}</p>
                    <div className="quick-details">
                        <p><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <p><strong>Audience Score:</strong> {movie.vote_average} ({movie.vote_count} votes)</p>
                        <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
                        {movie.certification && <p><strong>Content Rating:</strong> {movie.certification}</p>}
                    </div>
                    <div className="additional-details">
                        {movie.genres && <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>}
                        {movie.spoken_languages && <p><strong>Languages:</strong> {movie.spoken_languages.join(', ')}</p>}
                        {movie.actors && <p><strong>Cast:</strong> {movie.actors.join(', ')}</p>}
                        {movie.directors && <p><strong>Director:</strong> {movie.directors.join(', ')}</p>}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default MovieDetails;
