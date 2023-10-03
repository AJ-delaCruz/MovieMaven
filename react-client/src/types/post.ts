export interface PostType {
    id: number;
    username: string;
    movieId?: number;
    text: string;
    created_at: Date;
    updated_at: Date;
    likeCount?: number;
    is_author?: boolean;

}