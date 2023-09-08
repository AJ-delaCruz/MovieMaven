import { MovieType } from '../../types/movie';
import "./movie.scss";

interface MovieProps {
    movie: MovieType;
}

const Movie: React.FC<MovieProps> = ({ movie }) => {
    return (
        <div className="movie-card">
            {
                movie.poster_path
                    ? <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} loading="lazy" alt={movie.title} />
                    : <h3>No Image Available</h3>
            }

            {/* <h3>{movie.title}</h3> */}
        </div>
    );
}

export default Movie