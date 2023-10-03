
import { useContext, useEffect, useState } from 'react';
import { Button, Divider, TextField } from '@mui/material';
import { usePostContext } from '../../contextAPI/PostContext';
import Post from './Post';
import { PostType } from '../../types/post';
import { MovieType } from '../../types/movie';

import './discussion.scss';

interface DiscussionProps {
    movie: MovieType;
}
const Discussion: React.FC<DiscussionProps> = ({ movie }) => {

    const { posts, addPost, fetchPosts } = usePostContext();

    const [postText, setPostText] = useState('');

    const handleSubmitPost = () => {
        if (postText.trim() && movie.tmdb_id !== undefined) {
            addPost(movie.tmdb_id, postText);
            setPostText('');
        }
    };

    useEffect(() => {
        if (movie.tmdb_id !== undefined) {
            fetchPosts(movie.tmdb_id);
        }
    }, [])


    return (

        <div className="discussion-container">

            <h2 className="discussion-title">
                Discussions
            </h2>
            <div className="add-post-section">
                <TextField
                    label="Join the discussion"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSubmitPost} className="add-post-btn">
                    Post
                </Button>
            </div>

            <div className="posts-section">
                {posts.length > 0 ? (
                    posts.map((post: PostType) => (
                        <Post key={post.id} post={post} />
                    ))
                ) : (
                    <div className="empty-posts-state">
                        <p>No discussions for this movie yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export default Discussion;