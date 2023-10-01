import { IconButton, Tooltip } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDiscussionContext } from "../../contextAPI/DiscussionContext";
import { PostType } from "../../types/post";

interface DeleteButtonProps {
    comment: PostType;
}

const DeleteCommentButton: React.FC<DeleteButtonProps> = ({ comment }) => {
    const { removeComment} = useDiscussionContext();
    const handleDelete = () => {
        removeComment(comment.id);
    };
    return (
        <div >

            <Tooltip
                title={
                    <div className='tooltip-content'>
                        {'Delete comment'}

                    </div>
                }>
                <IconButton onClick={handleDelete}>

                    <DeleteForeverIcon />
                </IconButton>
            </Tooltip>
        </div>
    );
}

export default DeleteCommentButton;
