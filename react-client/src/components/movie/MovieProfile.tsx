import { Link } from "react-router-dom";
import { MovieType } from "../../types/movie";
import RatingIcon from "../rating/RatingIcon";
import RatingButton from "../user/rating/RatingButton";
import { useState } from "react";
import { useProfileContext } from "../../contextAPI/ProfileContext";
import WatchlistButton from "../user/watchlist/WatchlistButton";
import FavoriteButton from "../user/favorite/FavoriteButton";
import DeleteMovieButton from "../user/delete/DeleteMovieButton";

interface MovieProps {
    movie: MovieType;
}

const MovieProfile: React.FC<MovieProps> = ({ movie }) => {
    const [ratingAnchor, setRatingAnchor] = useState<null | HTMLElement>(null);
    const { activeTab } = useProfileContext();

    const openRatingModal = (e: React.MouseEvent<HTMLElement>) => {
        setRatingAnchor(e.currentTarget);
    };

    const closeRatingModal = () => {
        setRatingAnchor(null);
    };

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



                <div style={{ display: 'flex', marginTop: '30px' }}>
                    <FavoriteButton movie={movie} />

                    <WatchlistButton movie={movie} />

                    <RatingButton
                        movie={movie}
                        isRatingPopoverOpen={Boolean(ratingAnchor)}
                        ratingAnchorEl={ratingAnchor}
                        onRatingPopoverClose={closeRatingModal}
                        onRatingPopoverOpen={openRatingModal}
                    />

                </div>

            </div>


            <div>
                <DeleteMovieButton movie={movie} tabType={activeTab} />
            </div>

        </div>
    );
}

export default MovieProfile;


