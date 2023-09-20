import { Link } from "react-router-dom";
import { MovieType } from "../../types/movie";
import MovieMenu from "./MovieMenu";
import RatingIcon from "./RatingIcon";

interface MovieProps {
    movie: MovieType;
}

const MovieProfile: React.FC<MovieProps> = ({ movie }) => {
    return (
        <div className="profile-movie">
            <Link to={`/movie/${movie.id}`}>
                <div className="image-container">
                    {movie.poster_path
                        ? <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} loading="lazy" alt={movie.title} />
                        : <h3>No Image Available</h3>}
                </div>
            </Link>
            <div className="details-container">
                <h3>{movie.title}</h3>
                <div style={{ color: '#b0b0b0' }}>
                    {new Date(movie.release_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <RatingIcon rating={movie.vote_average || 0} />
                <p>{movie.overview}</p>
            </div>
            <div>
                <MovieMenu movie={movie} />
            </div>
        </div>
    );
}

export default MovieProfile;
