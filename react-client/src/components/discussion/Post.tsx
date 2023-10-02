import { Card, CardContent, Avatar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useAuthContext } from '../../contextAPI/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { MoreVert } from '@mui/icons-material';
import { PostType } from '../../types/post';
import './post.scss';
import DeletePostButton from './DeletePostButton';
import EditPostButton from './EditPostButton';

interface PostProps {
    post: PostType;

}

const Post: React.FC<PostProps> = ({ post }) => {
    const isAuthor = Boolean(post.username === 'Alice');

    const renderTime = () => {
        const createdAt = new Date(post.created_at);
        const updatedAt = new Date(post.updated_at);
        const timeDifference = updatedAt.getTime() - createdAt.getTime();

        //5 min grace period until a post as "edited"
        if (timeDifference > 5 * 60 * 1000) {
            return `Edited ${createdAt.toLocaleString()}`;
        }
        return createdAt.toLocaleString();
    };

    //menu item for editing/removing post
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
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
                            <Button size="small" color="primary" startIcon={<ThumbUpIcon />}>
                                {post.likeCount}
                            </Button>
                            <Button size="small" color="primary">
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
                                    <EditPostButton post={post} />
                                </MenuItem>
                                <MenuItem>
                                    <DeletePostButton post={post} />
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );


}
export default Post;
