import axios from "axios";
import { ReactNode, createContext, useContext, useState } from "react";
import { backendUrl } from "../utils/config";
import { usePostContext } from "./PostContext";

type LikeContextType = {
    // likedPosts: Record<number, boolean>; // object with post IDs 
    likePost: (postId: number) => void;
    unlikePost: (postId: number) => void;
    // fetchLikes: () => void;

};

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const useLikeContext = () => {
    const context = useContext(LikeContext);
    if (!context) {
        throw new Error("LikeContext must be used within LikeProvider");
    }
    return context;
};


interface LikeProviderProps {
    children: ReactNode;
}

export const LikeProvider: React.FC<LikeProviderProps> = ({ children }) => {
    // const initialPostIds = JSON.parse(localStorage.getItem('likes') || '{}');
    // const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>(initialPostIds);
    const { posts, setPosts } = usePostContext();


    const likePost = async (postId: number) => {

        //optimistic update UI
        const optimisticPosts = posts.map(post =>
            post.id === postId ?
                {
                    ...post, is_liked_by_user: true, likes_count: post.likes_count + 1
                }
                : post
        );
        setPosts(optimisticPosts);

        try {
            await axios.post(`${backendUrl}/api/likes/like/${postId}`, null, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });
            // // store post id after Liked post (future use)
            // setLikedPosts(prev => ({...prev, [postId]: true}));


            // // update isLikedByUser to true for Post 
            // const updatedPosts = posts.map(post =>
            //     post.id === postId ? 
            //     { 
            //         ...post, is_liked_by_user: true, likes_count: post.likes_count + 1 
            //     } 
            //     : post
            // );
            // setPosts(updatedPosts);
        } catch (error) {
            console.error("Failed to like post:", error);

            // revert the optimistic update if API call fails
            const revertedPosts = posts.map(post =>
                post.id === postId ?
                    { ...post, is_liked_by_user: false, likes_count: post.likes_count - 1 }
                    : post
            );
            setPosts(revertedPosts);

        }
    };

    const unlikePost = async (postId: number) => {
        try {
            await axios.delete(`${backendUrl}/api/likes/unlike/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });
            // // Unlike a post (future use)
            // setLikedPosts(prevLikeIds => {
            //     const updatedLikeIds = { ...prevLikeIds };
            //     delete updatedLikeIds[postId]; //delete key PostId property from likes object
            //     return updatedLikeIds; //callback
            // });

            // update isLikedByUser to false 
            const updatedPosts = posts.map(post =>
                post.id === postId ?
                    {
                        ...post, is_liked_by_user: false, likes_count: post.likes_count - 1
                    }
                    : post
            );
            setPosts(updatedPosts);
        } catch (error) {
            console.error("Failed to unlike post:", error);
        }
    };

    return (
        <LikeContext.Provider value={{ likePost, unlikePost }}>
            {children}
        </LikeContext.Provider>
    );
};
