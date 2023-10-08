import { Link } from 'react-router-dom';
import { MovieType } from '../../types/movie';
import "./movie.scss";
import MovieMenu from './MovieMenu';
import RatingIcon from '../rating/RatingIcon';
import { useState } from 'react';


interface MovieProps {
    movie: MovieType;

}

const Movie: React.FC<MovieProps> = ({ movie }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); //let preview open when menu is clicked

    return (
        <div className="movie-card-wrapper">
            <div className={`movie-card ${isMenuOpen ? 'active' : ''}`} >
                <Link to={`/movie/${movie.id}`}>
                    {
                        movie.backdrop_path
                            ? <img className="movie-poster" src={`https://image.tmdb.org/t/p/w400${movie.backdrop_path}`} loading="lazy" alt={movie.title} />
                            : <h3 className="no-image-placeholder">No Image Available</h3>
                    }
                </Link>

                <div className={`movie-preview ${isMenuOpen ? 'active' : ''}`}>

                    <div className="movie-header">
                        <h3>{movie.title}</h3>

                        <div className='movie-menu'>
                            <MovieMenu movie={movie} onMenuToggle={setIsMenuOpen} />
                        </div>
                    </div>

                    <div className="other-details">

                        <RatingIcon rating={movie.vote_average || 0} />

                        <span>{new Date(movie.release_date).toLocaleDateString(undefined, { year: 'numeric' })}</span>


                    </div>

                    <p>{movie.overview}</p>

                </div>

                {/* <div className="movie-title">{movie.title}</div> */}

            </div>

        </div>

    );
}

export default Movie