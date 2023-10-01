export interface PostType {
    id: string;
    username: string;
    text: string;
    created_at: Date;
    updated_at: Date;
    likeCount?: number;
}