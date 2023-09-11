import { Link } from 'react-router-dom';
import { MovieType } from '../../types/movie';
import "./movie.scss";
import { useState } from 'react';

interface MovieProps {
    movie: MovieType;

}

const Movie: React.FC<MovieProps> = ({ movie }) => {

    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link to={`/movie/${movie.id}`}>

            <div className="movie-card"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {
                    movie.poster_path
                        ? <img className="movie-poster" src={`https://image.tmdb.org/t/p/w400${movie.backdrop_path}`} loading="lazy" alt={movie.title} />
                        : <h3>No Image Available</h3>
                }
                {/* <div className="movie-title">{movie.title}</div> */}


                {
                    isHovered ? (
                        <div className="movie-preview">
                            <h3>{movie.title}</h3>
                            <p>{movie.overview}</p>

                        </div>
                    ) :
                        (<div className="movie-title">{movie.title}</div>)

                }



                {/* <h3>{movie.title}</h3> */}
            </div>
        </Link>

    );
}

export default Movie