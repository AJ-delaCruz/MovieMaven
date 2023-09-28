import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Rating from '../../rating/Rating';
import { MovieType } from '../../../types/movie';
import { useRatingsContext } from '../../../contextAPI/RatingsContext';
import { IconButton, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface RatingButtonProps {
    movie: MovieType;
    isRatingPopoverOpen: boolean;
    ratingAnchorEl: null | HTMLElement;
    onRatingPopoverClose: () => void;
    onRatingPopoverOpen?: (e: React.MouseEvent<HTMLElement>) => void;
    showIcon?: boolean;
    colorTheme?: "menu" | "card";

}

const RatingButton: React.FC<RatingButtonProps> = (
    { movie,
        isRatingPopoverOpen,
        ratingAnchorEl,
        onRatingPopoverClose,
        onRatingPopoverOpen,
        showIcon = true,
        colorTheme
    }) => {

    const { ratings, addOrUpdateRating } = useRatingsContext();
    const userRating = ratings[movie.id] || 0;

    const handleRatingChange = (newRating: number) => {
        addOrUpdateRating(movie, newRating);
        // onRatingPopoverClose();
    };


    const starColor = () => {
        if (userRating > 0) {
            return "gold";
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
        <div>


            {showIcon && (

                <Tooltip
                    title={
                        <div className='tooltip-content'>
                            {userRating > 0 ? 'Update Rating' : 'Add a rating'}

                        </div>
                    }>
                    <IconButton style={iconButtonStyle} onClick={onRatingPopoverOpen}>
                        <StarIcon fontSize="medium" style={{ color: starColor(), marginLeft: '0px' }} />
                    </IconButton>
                </Tooltip>

            )}

            <Popover
                open={isRatingPopoverOpen}
                anchorEl={ratingAnchorEl}
                onClose={onRatingPopoverClose}
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
                    <Rating currentRating={userRating} onRatingChange={handleRatingChange} movieId={movie.id} />
                </Box>
            </Popover>
        </div>
    );
}

export default RatingButton;



