import { Card, CardContent, Avatar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useAuthContext } from '../../contextAPI/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import './comment.scss';
import { MoreVert } from '@mui/icons-material';
import DeleteCommentButton from './DeleteCommentButton';
import EditCommentButton from './EditCommentButton';
import { PostType } from '../../types/post';

interface CommentProps {
    comment: PostType;

}

const Comment: React.FC<CommentProps> = ({ comment }) => {
    const isAuthor = Boolean(comment.username === 'Alice');

    const renderTime = () => {
        const createdAt = new Date(comment.created_at);
        const updatedAt = new Date(comment.updated_at);
        const timeDifference = updatedAt.getTime() - createdAt.getTime();

        //5 min grace period until a comment as "edited"
        if (timeDifference > 5 * 60 * 1000) {
            return `Edited ${createdAt.toLocaleString()}`;
        }
        return createdAt.toLocaleString();
    };

    //menu item for editing/removing comment
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };



    return (
        <Card className="comment-card">
            <CardContent>
                <div className="comment-header">
                    <Avatar className="comment-avatar">
                        {comment.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="right-section">
                        <div className="comment-details">
                            <Typography variant="h6">{comment.username}</Typography>
                            <Typography className='date' variant="caption">{renderTime()}</Typography>
                        </div>
                        <Typography variant="body2" color="white" className="comment-text">
                            {comment.text}
                        </Typography>
                        <div className="comment-actions">
                            <Button size="small" color="primary" startIcon={<ThumbUpIcon />}>
                                {comment.likeCount}
                            </Button>
                            <Button size="small" color="primary">
                                Reply
                            </Button>
                        </div>
                    </div>
                    {isAuthor && (
                        <div className='comment-menu'>
                            <IconButton onClick={(e) => handleOpenMenu(e)}>
                                <MoreVert style={{ color: 'white' }} />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                                <MenuItem>
                                    <EditCommentButton comment={comment} />
                                </MenuItem>
                                <MenuItem>
                                    <DeleteCommentButton comment={comment} />
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );


}
export default Comment;
