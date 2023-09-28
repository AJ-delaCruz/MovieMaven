import { Alert, Snackbar } from '@mui/material';
import React, { useState, useCallback, useContext, ReactNode } from 'react';
import { createContext } from 'react';

type ShowSnackbar = (message: string, severity?: "error" | "success" | "warning" | "info") => void;

const SnackbarContext = createContext<ShowSnackbar | undefined>(undefined);
export const useSnackbarContext = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("SnackbarContext must be used within SnackbarProvider");
    }
    return context;
};

type Severity = "error" | "success" | "warning" | "info";

interface ReusableSnackbarProps {
    initialOpen?: boolean;
    initialMessage?: string;
    initialSeverity?: Severity;
    children?: ReactNode;

}

const SnackbarProvider: React.FC<ReusableSnackbarProps> = (
    {
        initialOpen = false,
        initialMessage = "",
        initialSeverity = "success",
        children
    }) => {

    const [open, setOpen] = useState(initialOpen);
    const [message, setMessage] = useState(initialMessage);
    const [severity, setSeverity] = useState(initialSeverity);

    const showSnackbar = useCallback((message: string, severity: Severity = "success") => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
    }, []);

    const closeSnackbar = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <SnackbarContext.Provider value={showSnackbar}>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={closeSnackbar} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
            {children}
        </SnackbarContext.Provider>
    );
}

export default SnackbarProvider;
