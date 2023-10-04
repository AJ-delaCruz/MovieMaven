export interface PostType {
    id: number;
    username: string;
    movieId?: number;
    text: string;
    created_at: Date;
    updated_at: Date;
    likes_count: number;
    is_author?: boolean;

    is_liked_by_user?: boolean;

}