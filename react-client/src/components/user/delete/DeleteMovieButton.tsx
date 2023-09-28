import { IconButton, Tooltip } from "@mui/material";
import { useFavoritesContext } from "../../../contextAPI/FavoritesContext";
import { useRatingsContext } from "../../../contextAPI/RatingsContext";
import { useWatchlistContext } from "../../../contextAPI/WatchlistContext";
import { MovieType } from "../../../types/movie";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface DeleteButtonProps {
    movie: MovieType;
    tabType?: string;
}

const DeleteMovieButton: React.FC<DeleteButtonProps> = ({ movie, tabType }) => {
    const { removeFavorite } = useFavoritesContext();
    const { removeFromWatchlist } = useWatchlistContext();
    const { removeRating } = useRatingsContext();

    const handleDelete = () => {
        switch (tabType) {
            case 'favorites':
                removeFavorite(movie.id);
                break;
            case 'watchlist':
                removeFromWatchlist(movie.id);
                break;
            case 'ratings':
                removeRating(movie.id);
                break;
            default:
                console.error("Movie's tab type provided to DeleteButton is invalid");
        }
    };

    return (
        <div style={{ padding: '10px' }}>
            {/* <IconButton sx={{ background: 'white', color: 'black', padding: '10px' }} onClick={handleDelete}> */}

            <Tooltip
                title={
                    <div className='tooltip-content'>
                        {'Remove movie'}

                    </div>
                }>
                <IconButton style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#E0E0E0', padding: '10px' }} onClick={handleDelete}>

                    <DeleteForeverIcon />
                </IconButton>
            </Tooltip>
        </div>
    );
}

export default DeleteMovieButton;
