import React from 'react'
import { MovieType } from '../../../types/movie';
import MovieProfile from '../../movie/MovieProfile';

const WatchList: React.FC<{ movies: MovieType[] }> = ({ movies }) => {
    return (
        <div className="watchlist-section">
            {movies.length > 0 ? <h3>Watchlist</h3> : <h3> No Movies</h3>}

            <div className="profile-movie-grid">
                {movies.map(movie => <MovieProfile key={movie.id} movie={movie} />)}
            </div>
        </div>
    );
}

export default WatchList;