import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { usePostContext } from "../../contextAPI/PostContext";
import { useState } from "react";
import { PostType } from "../../types/post";

interface EditButtonProps {
    post: PostType;
    closeMenu: () => void;

}

const EditPostButton: React.FC<EditButtonProps> = ({ post, closeMenu }) => {

    const { updatePost } = usePostContext();
    const [updateText, setUpdateText] = useState(post.text);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);

        // Close the menu after cancel
        closeMenu();
    };

    const handleUpdate = () => {
        updatePost(post.id, updateText);
        handleClose();

        // Close the menu after updating
        closeMenu();
    };

    return (
        <div>
            <Tooltip
                title={
                    <div className='tooltip-content'>
                        {'Update post'}
                    </div>
                }>
                <IconButton onClick={handleOpen}>
                    <EditIcon />
                </IconButton>
            </Tooltip>

            {/* Edit Post Dialog */}
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth={true}>
                <DialogTitle id="form-dialog-title">Update Post</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        Edit post:
                    </DialogContentText> */}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        // label="Text"
                        type="text"
                        multiline
                        rows={4}
                        fullWidth
                        value={updateText}
                        onChange={e => setUpdateText(e.target.value)}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
                    </Button>
                </DialogActions>

            </Dialog>
        </div>
    );
}

export default EditPostButton;
