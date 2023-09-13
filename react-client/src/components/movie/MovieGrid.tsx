import { MovieType } from '../../types/movie';
import Movie from './Movie';
import "./movie.scss";

interface MovieGridProps {
    movies: MovieType[];
}

const MovieList: React.FC<MovieGridProps> = ({ movies }) => {

    return (
        <div className="movie-grid">
            {movies.map(movie => <Movie key={movie.id} movie={movie} />)}
        </div>
    );
}

export default MovieList;
