import { MovieType } from '../../../types/movie';
import { useFavoritesContext } from '../../../contextAPI/FavoritesContext';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface FavoriteProps {
    movie: MovieType;
}

const FavoriteButton: React.FC<FavoriteProps> = ({ movie }) => {
    const { favoritesMovieIds, addFavorite, removeFavorite } = useFavoritesContext();

    const handleFavoriteToggle = () => {
        if (favoritesMovieIds[movie.id]) {
            removeFavorite(movie.id);
        } else {
            addFavorite(movie);
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
                        {'Mark as favorite'}

                    </div>
                }>
                <IconButton onClick={handleFavoriteToggle}>
                    <FavoriteIcon style={{ color: favoritesMovieIds[movie.id] ? "red" : "inherit" }} />
                </IconButton>
            </Tooltip>
        </div>

    );
}

export default FavoriteButton;
