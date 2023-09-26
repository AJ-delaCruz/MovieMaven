import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { MovieType } from '../../../types/movie';
import { IconButton, Tooltip } from '@mui/material';
import { useWatchlistContext } from '../../../contextAPI/WatchlistContext';

interface WatchlistProps {
    movie: MovieType;
}

const WatchlistButton: React.FC<WatchlistProps> = ({ movie }) => {
    const { watchlistMovieIds, addToWatchlist, removeFromWatchlist } = useWatchlistContext();

    const handleWatchlistToggle = () => {
        if (watchlistMovieIds[movie.id]) {
            removeFromWatchlist(movie.id);
        } else {
            addToWatchlist(movie);
        }
    };

    return (
        <div>
            <Tooltip
                title={
                    <div style={{
                        fontSize: '16px',
                        color: 'white',
                        padding: '5px 5px',
                        borderRadius: '6px',
                    }}>
                        {'Add to watchlist'}

                    </div>
                }>

                <IconButton onClick={handleWatchlistToggle}>
                    {watchlistMovieIds[movie.id]
                        ? <BookmarkRemoveIcon style={{ color: "blue" }} />
                        : <BookmarkIcon />
                    }
                </IconButton>

            </Tooltip>
        </div >
    );
}

export default WatchlistButton;
