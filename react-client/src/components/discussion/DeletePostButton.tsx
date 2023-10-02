import { IconButton, Tooltip } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { usePostContext } from "../../contextAPI/PostContext";
import { PostType } from "../../types/post";

interface DeleteButtonProps {
    post: PostType;
}

const DeletepostButton: React.FC<DeleteButtonProps> = ({ post }) => {
    const { removePost } = usePostContext();
    const handleDelete = () => {
        removePost(post.id);
    };
    return (
        <div >

            <Tooltip
                title={
                    <div className='tooltip-content'>
                        {'Delete post'}

                    </div>
                }>
                <IconButton onClick={handleDelete}>

                    <DeleteForeverIcon />
                </IconButton>
            </Tooltip>
        </div>
    );
}

export default DeletepostButton;
