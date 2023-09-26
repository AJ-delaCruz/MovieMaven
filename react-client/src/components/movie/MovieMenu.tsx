import React, { useState } from 'react'
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { MovieType } from '../../types/movie';
import StarIcon from '@mui/icons-material/Star';
import { useRatingsContext } from '../../contextAPI/RatingsContext';
import FavoriteButton from '../user/favorite/FavoriteButton';
import WatchlistButton from '../user/watchlist/WatchlistButton';
import RatingButton from '../user/rating/RatingButton';
import './movie.scss';
interface MovieMenuProps {
    movie: MovieType;
    onMenuToggle?: (isOpen: boolean) => void; //to keep preview display

}

const MovieMenu: React.FC<MovieMenuProps> = ({ movie, onMenuToggle }) => {
    const { ratings } = useRatingsContext();

    //menu item for adding to watchlist or favorite
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [ratingAnchor, setRatingAnchor] = useState<null | HTMLElement>(null); //refrence anchorlEl for rating modal

    const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
        if (onMenuToggle) onMenuToggle(true);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        if (onMenuToggle) onMenuToggle(false);//close movie preview 
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


    return (
        <div className='movie-menu'>
            <IconButton style={{ backgroundColor: '#cccc' }} onClick={(e) => handleOpenMenu(e)}>
                <MoreVert />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>

                {/* add to watchlist */}
                <MenuItem>
                    <ListItemIcon>
                        <WatchlistButton movie={movie} />
                    </ListItemIcon>
                    <ListItemText primary="Watchlist" />
                </MenuItem>

                {/* add to favorite */}
                <MenuItem>
                    <ListItemIcon>
                        <FavoriteButton movie={movie} />
                    </ListItemIcon>
                    <ListItemText primary="Favorite" />
                </MenuItem>

                {/* Rating movies */}
                <MenuItem onClick={openRatingModal}>
                    <Tooltip
                        title={
                            <div style={{
                                fontSize: '16px',
                                color: 'white',
                                padding: '5px 5px',
                                // borderRadius: '16px',
                            }}>
                                {'Add a rating'}

                            </div>
                        }>
                        <ListItemIcon>
                            <IconButton >
                                <StarIcon fontSize="medium" style={{ color: ratings[movie.id] > 0 ? "gold" : "inherit", marginLeft: '1px' }} />
                            </IconButton>

                        </ListItemIcon>
                    </Tooltip>
                    <ListItemText primary="Rating" />
                </MenuItem>
            </Menu>



            {/* render the rating popover */}
            <RatingButton
                isRatingPopoverOpen={Boolean(ratingAnchor)}
                ratingAnchorEl={ratingAnchor}
                onRatingPopoverClose={closeRatingModal}
                onRatingPopoverOpen={openRatingModal}

                movie={movie}
                showIcon={false} //hide menu's star icon 
            />
        </div >
    )
}

export default MovieMenu
