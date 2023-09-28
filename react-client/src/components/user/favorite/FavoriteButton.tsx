import { useFavoritesContext } from '../../../contextAPI/FavoritesContext';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './button.scss';
import { ButtonType } from '../../../types/button';


const FavoriteButton: React.FC<ButtonType> = ({ movie, colorTheme }) => {
    const { favoritesMovieIds, addFavorite, removeFavorite } = useFavoritesContext();

    const handleFavoriteToggle = () => {
        if (favoritesMovieIds[movie.id]) {
            removeFavorite(movie.id);
        } else {
            addFavorite(movie);
        }
    };

    const favoriteColor = () => {
        if (favoritesMovieIds[movie.id]) {
            return "red"; // favorited
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
                        {favoritesMovieIds[movie.id] ? 'Unmark as favorite' : 'Mark as favorite'}

                    </div>
                }>
                <IconButton
                    style={iconButtonStyle}
                    onClick={handleFavoriteToggle}>
                    <FavoriteIcon style={{ color: favoriteColor() }} />
                </IconButton>
            </Tooltip>
        </div>

    );
}

export default FavoriteButton;
