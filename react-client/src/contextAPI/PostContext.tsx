import React, { ReactNode, createContext, useContext, useState } from "react";
import axios from "axios";
import { backendUrl } from "../utils/config";
import { PostType } from "../types/post";
import { useSnackbarContext } from "./SnackBarAlertContext";

type PostContextType = {
    posts: PostType[];
    addPost: (movieId: string, text: string) => void;
    removePost: (postId: string) => void;
    updatePost: (postId: string, updatedText: string) => void;
    fetchPosts: (movieId: string) => void;

};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePostContext = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("PostContext must be used within PostProvider");
    }
    return context;
};

interface PostProviderProps {
    children: ReactNode;
}
export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const showSnackbar = useSnackbarContext();


    const addPost = async (movieId: string, text: string) => {
        try {
            const response = await axios.post(`${backendUrl}/api/posts/movie/${movieId}`, { post: text }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });

            const newPost: PostType = response.data;
            setPosts(prevPosts => [...prevPosts, newPost]);
            showSnackbar("Post added successfully!", "success");
        } catch (error) {
            console.error("Failed to add post:", error);
            showSnackbar("Failed to add post. Please try again!", "error");
        }
    };


    const removePost = async (postId: string) => {
        // Remove post from the movie's discussion
        try {
            const response = await axios.delete(`${backendUrl}/api/posts/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });

            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
            showSnackbar("Post removed successfully!", "success");
        } catch (error) {
            console.error("Failed to remove post: ", postId, error);
            showSnackbar("Failed to remove post. Please try again.", "error");
        }
    };

    const updatePost = async (postId: string, updatedText: string) => {
        // Update a specific post in the movie's discussion
        try {
            const response = await axios.put(`${backendUrl}/api/posts/${postId}`, { text: updatedText }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });
            if (response.status === 200) {
                setPosts(prev => prev.map(post => post.id === postId ? { ...post, text: updatedText } : post));
                showSnackbar("Post updated successfully!", "success");
            }
        } catch (error) {
            console.error("Failed to update post:", error);
            showSnackbar("Failed to update post. Please try again!", "error");
        }
    };

    const fetchPosts = async (movieId: string) => {
        // Fetch posts for the movie
        try {
            const { data } = await axios.get(`${backendUrl}/api/posts/movie/${movieId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            setPosts(data);
        } catch (err) {
            console.error("Failed to retrieve posts: ", err);
        }
    };

    return (
        <PostContext.Provider value={{ posts, fetchPosts, addPost, removePost, updatePost }}>
            {children}
        </PostContext.Provider>
    );
};
