import { useState, useEffect } from "react";
import { backendUrl } from "../../utils/config";
import axios, { AxiosError } from "axios";
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { CircularProgress } from '@mui/material';
import { useAuthContext } from "../../contextAPI/AuthContext";
import { ERROR_MESSAGES } from "../../utils/errorMessage";

// type AxiosError = {  // custom
//     response?: {
//         data?: string;
//     };
// };

const Login: React.FC = () => {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { currentUser, login } = useAuthContext(); //access the custom hook for auth context shared state
    const navigate = useNavigate();


    // const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    const submitLogin = async (e: React.FormEvent) => {
        setIsLoading(true);

        e.preventDefault();

        try {
            const res = await axios.post(`${backendUrl}/api/auth/login`, {
                username: username,
                password: password
            });

            console.log(res.data);
            const { access_token } = res.data;
            await login(access_token)

            // Navigate to home page after successful login
            navigate('/');
        } catch (err) {
            console.log(err);
            // setErrorMessage(err.response.data.message);
            const error = err as AxiosError;

            if (error.response && typeof error.response.data === 'string') {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage(ERROR_MESSAGES.UNEXPECTED);
            }
        } finally {
            setIsLoading(false);
        }


    };

    //navigate to the homepage ('/') when the currentUser state is updated after succesful login
    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);


    return (
        <div className='grid-box'>
            <div className='form'>
                <div className='auth-header'>
                    <h3>Login here</h3>
                </div>
                <form onSubmit={submitLogin} className='auth-form'>
                    <TextField
                        id='outlined-basic'
                        name="username"
                        label='Username'
                        variant='outlined'
                        autoComplete='username'
                        autoFocus
                        required
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                    <TextField
                        id='outlined-password-input'
                        name="password"
                        label='Password'
                        type='password'
                        required

                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />

                    <Button type='submit' variant='contained' disabled={isLoading}>
                        Login
                    </Button>
                </form>


                {isLoading && <CircularProgress />}

                {errorMessage && <p>{errorMessage}</p>}

                <div className='button-container'>
                    <span>Don't have an account?</span>
                    <Link to="/register">
                        <Button type='submit' variant='contained' color="secondary">Register</Button>
                    </Link>
                </div>
            </div>


        </div>
    );

}

export default Login;