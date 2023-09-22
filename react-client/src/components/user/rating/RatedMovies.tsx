import React from 'react'
import { MovieType } from '../../../types/movie';
import MovieProfile from '../../movie/MovieProfile';

const RatedMovies: React.FC<{ movies: MovieType[] }> = ({ movies }) => {
    return (
        <div className="rated-section">
            {movies.length > 0 ? <h3>Ratings</h3> : <h3> No Movies</h3>}

            <div className="profile-movie-grid">
                {movies.map(movie => <MovieProfile key={movie.id} movie={movie} />)}
            </div>
        </div>
    );
}

export default RatedMovies;