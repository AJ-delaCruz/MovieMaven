import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { IconButton, Tooltip } from '@mui/material';
import { useWatchlistContext } from '../../../contextAPI/WatchlistContext';
import { ButtonType } from '../../../types/button';


const WatchlistButton: React.FC<ButtonType> = ({ movie, colorTheme }) => {
    const { watchlistMovieIds, addToWatchlist, removeFromWatchlist } = useWatchlistContext();

    const handleWatchlistToggle = () => {
        if (watchlistMovieIds[movie.id]) {
            removeFromWatchlist(movie.id);
        } else {
            addToWatchlist(movie);
        }
    };

    const watchlistColor = () => {
        if (watchlistMovieIds[movie.id]) {
            return "blue";
        } else {
            return colorTheme === "menu" ? "gray" : "#E0E0E0"; //gray for menu, light gray for movie card
        }
    };

    const backgroundColor = colorTheme === "menu" ? "" : "rgba(255, 255, 255, 0.2)";
    const iconButtonStyle = colorTheme === "menu" ? {
        backgroundColor: backgroundColor
    } : {
        backgroundColor: backgroundColor,
        padding: '10px'
    };

    return (
        <div >
            <Tooltip
                title={
                    <div className='tooltip-content'>
                        {watchlistMovieIds[movie.id] ?
                            'Remove from watchlist'
                            : 'Add to watchlist'}

                    </div>
                }>

                <IconButton
                    style={iconButtonStyle}
                    onClick={handleWatchlistToggle}>
                    {watchlistMovieIds[movie.id]
                        ? <BookmarkRemoveIcon style={{ color: watchlistColor() }} />
                        : <BookmarkIcon style={{ color: watchlistColor() }} />
                    }
                </IconButton>

            </Tooltip>
        </div >
    );
}

export default WatchlistButton;
