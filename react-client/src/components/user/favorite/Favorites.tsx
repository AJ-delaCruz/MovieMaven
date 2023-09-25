import React from 'react'
import { MovieType } from '../../../types/movie';
import MovieProfile from '../../movie/MovieProfile';

const Favorites: React.FC<{ movies: MovieType[] }> = ({ movies }) => {
    return (
        <div className="favorites-section">
            {movies.length > 0 ? <h3>Favorites</h3> : <h3> No Movies</h3>}

            <div className="profile-movie-grid">
                {movies.map(movie => <MovieProfile key={movie.id} movie={movie} />)}
            </div>
        </div>
    );
}

export default Favorites;
