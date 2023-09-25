import React, { useState } from 'react'
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Box, Typography, Popover } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { MovieType } from '../../types/movie';
import StarIcon from '@mui/icons-material/Star';
import Rating from '../rating/Rating';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import './movie.scss';
import { useRatingsContext } from '../../contextAPI/RatingsContext';
import { useFavoritesContext } from '../../contextAPI/FavoritesContext';
import { useWatchlistContext } from '../../contextAPI/WatchlistContext';
interface MovieMenuProps {
    movie: MovieType;
    onMenuToggle?: (isOpen: boolean) => void; //to keep preview display

}

const MovieMenu: React.FC<MovieMenuProps> = ({ movie, onMenuToggle }) => {
    // console.log("Rendering MovieMenu for movie:", movie.title);
    const { ratings, addOrUpdateRating } = useRatingsContext();
    const userRating = ratings[movie.id] || 0;
    const { favoritesMovieIds, addFavorite, removeFavorite } = useFavoritesContext();
    const { watchlistMovieIds, addToWatchlist, removeFromWatchlist } = useWatchlistContext();

    //menu item for adding to watchlist or favorite
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [ratingAnchor, setRatingAnchor] = useState<null | HTMLElement>(null); //refrence anchorlEl for rating modal

    const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
        if (onMenuToggle) onMenuToggle(true);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        if (onMenuToggle) onMenuToggle(false);
    };

    const openRatingModal = () => {
        setRatingAnchor(anchorEl);  // copy the reference from anchorEl to ratingAnchor
        setAnchorEl(null);
        // handleCloseMenu();  // ?close the menu after opening the rating modal
    };

    // reset the anchorModal state
    const closeRatingModal = () => {
        setRatingAnchor(null);
        if (onMenuToggle) onMenuToggle(false); //close preview after
    }

    //  add/remove movie to watchlist
    const handleWatchlistToggle = async (movie: MovieType) => {
        if (watchlistMovieIds[movie.id]) {
            removeFromWatchlist(movie.id);
        } else {
            addToWatchlist(movie);
        }
        //  handleCloseMenu();
    };




    // add/remove movie to favorites
    const handleFavoriteToggle = async (movie: MovieType) => {
        if (favoritesMovieIds[movie.id]) {
            removeFavorite(movie.id);
        } else {
            addFavorite(movie);
        }
        // handleCloseMenu();
    };


    //add rating
    const handleRatingChange = async (newRating: number) => {
        //rating context api
        addOrUpdateRating(movie, newRating);

        // closeRatingModal();  // close the modal once rating is set
    };

    return (
        <div className='movie-menu'>

            <IconButton style={{ backgroundColor: '#cccc' }} onClick={(e) => handleOpenMenu(e)}>
                <MoreVert />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>

                {/* add to watchlist */}
                <MenuItem onClick={() => handleWatchlistToggle(movie)}>
                    <ListItemIcon>
                        {watchlistMovieIds[movie.id]
                            ? <BookmarkRemoveIcon fontSize="small" style={{ color: "blue" }} />
                            : <BookmarkIcon fontSize="small" />
                        }
                    </ListItemIcon>
                    <ListItemText primary="Watchlist" />
                </MenuItem>

                {/* add to favorite */}
                <MenuItem
                    onClick={() => handleFavoriteToggle(movie)}
                >
                    <ListItemIcon>
                        <FavoriteIcon fontSize="small" style={{ color: favoritesMovieIds[movie.id] ? "red" : "inherit" }}
                        />
                    </ListItemIcon>
                    <ListItemText primary="Favorite" />
                </MenuItem>


                {/* Rating movies  */}
                <MenuItem
                    onClick={openRatingModal}
                >
                    <ListItemIcon>
                        <StarIcon fontSize="medium" style={{ color: userRating > 0 ? "gold" : "inherit", marginLeft: '-2px' }} />
                    </ListItemIcon>
                    <ListItemText primary="Rating" />
                </MenuItem>

            </Menu>


            <Popover
                open={Boolean(ratingAnchor)}
                anchorEl={ratingAnchor}
                onClose={closeRatingModal}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Box
                    sx={{
                        padding: '15px',
                        background: '#ffffff',
                        color: '#2e2e2e',
                        borderRadius: '5px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'background 0.2s',
                        '&:hover': {
                            background: '#f5f5f5',
                        },
                    }}
                >
                    {/* <Typography sx={{ marginLeft: '10px' }} variant="h6">Rate movie</Typography> */}
                    <Rating currentRating={userRating} onRatingChange={handleRatingChange} movieId={movie.id} />

                </Box>

            </Popover>
        </div >
    )
}

export default MovieMenu
