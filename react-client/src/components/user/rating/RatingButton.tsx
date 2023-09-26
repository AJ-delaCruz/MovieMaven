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

}

const RatingButton: React.FC<RatingButtonProps> = ({ movie, isRatingPopoverOpen, ratingAnchorEl, onRatingPopoverClose, onRatingPopoverOpen, showIcon = true }) => {
    const { ratings, addOrUpdateRating } = useRatingsContext();
    const userRating = ratings[movie.id] || 0;

    const handleRatingChange = (newRating: number) => {
        addOrUpdateRating(movie, newRating);
        // onRatingPopoverClose();
    };


    return (
        <div>


            {showIcon && (

                <Tooltip
                    title={
                        <div style={{
                            fontSize: '16px',
                            color: 'white',
                            padding: '5px 5px',
                            // borderRadius: '6px',
                        }}>
                            {'Add a rating'}

                        </div>
                    }>
                    <IconButton style={{ background: 'white' }} onClick={onRatingPopoverOpen}>
                        <StarIcon fontSize="medium" style={{ color: userRating > 0 ? "gold" : "inherit", marginLeft: '1px' }} />
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



