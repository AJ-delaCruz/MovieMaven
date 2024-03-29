import { Card, CardContent, Avatar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { MoreVert } from '@mui/icons-material';
import { PostType } from '../../types/post';
import './post.scss';
import DeletePostButton from './DeletePostButton';
import EditPostButton from './EditPostButton';
import { useLikeContext } from '../../contextAPI/LikesContext';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
interface PostProps {
    post: PostType;

}

const Post: React.FC<PostProps> = ({ post }) => {
    const isAuthor = post.is_author;
    const { likePost, unlikePost } = useLikeContext();

    const renderTime = () => {
        const createdAt = new Date(post.created_at);
        const updatedAt = new Date(post.updated_at);
        const timeDifference = updatedAt.getTime() - createdAt.getTime();

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        //5 min grace period until a post as "edited"
        if (timeDifference > 5 * 60 * 1000) {
            return createdAt.toLocaleString('default', options) + " Edited";
        }
        return createdAt.toLocaleString('default', options);
    };


    //menu item for editing/removing post
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    //handles like / unlike button
    const handleLikeClick = () => {
        if (post.is_liked_by_user) {
            unlikePost(post.id);
        } else {
            likePost(post.id);
        }
    };


    return (
        <Card className="post-card">
            <CardContent>
                <div className="post-header">
                    <Avatar className="post-avatar">
                        {post.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="right-section">
                        <div className="post-details">
                            <Typography variant="h6">{post.username}</Typography>
                            <Typography className='date' variant="caption">{renderTime()}</Typography>
                        </div>
                        <Typography variant="body2" color="white" className="post-text">
                            {post.text}
                        </Typography>
                        <div className="post-actions">

                            <Button className="like-button"
                                size="small"
                                onClick={handleLikeClick}
                                startIcon={
                                    post.is_liked_by_user ?
                                        <ThumbUpIcon className='like-button-liked' /> :
                                        <ThumbUpOffAltIcon className='like-button-not-liked' />
                                }
                            >
                                <span className={`like-count ${post.is_liked_by_user ? 'liked' : 'not-liked'}`}>{post.likes_count}</span>
                            </Button>


                            <Button size="small" className="reply-button">
                                Reply
                            </Button>

                        </div>
                    </div>
                    {isAuthor && (
                        <div className='post-menu'>
                            <IconButton onClick={(e) => handleOpenMenu(e)}>
                                <MoreVert style={{ color: 'white' }} />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                                <MenuItem>
                                    <EditPostButton post={post} closeMenu={handleCloseMenu} />
                                </MenuItem>
                                <MenuItem>
                                    <DeletePostButton post={post} />
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card >
    );


}
export default Post;
