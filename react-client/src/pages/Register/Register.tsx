import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { backendUrl } from "../../utils/config";
import { ERROR_MESSAGES } from "../../utils/errorMessage";
import axios, { AxiosError } from "axios";

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();


    const submitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            //registers user
            const res = await axios.post(`${backendUrl}/api/auth/register`, {
                username: username,
                password: password
            });

            // console.log(res.data);

            // Navigate to login page after successful register
            navigate('/login');
        } catch (err) {
            console.log(err);
            //set the error message
            // setErrorMessage(err.response.data.message);

            const error = err as AxiosError;

            if (error.response && typeof error.response.data === 'string') {
                setErrorMessage(error.response.data);
            }
            else {
                setErrorMessage(ERROR_MESSAGES.UNEXPECTED);
            }
        } finally {
            setIsLoading(false); // End the loading state
        }


    };

    return (
        <div className='grid-box-register'>

            <div className='form-register'>
                <div className='auth-header'>
                    <h3>Sign up here</h3>
                </div>


                <form onSubmit={submitRegister} className='auth-form'>
                    <TextField
                        id='outlined-basic'
                        name='username'
                        label='Username'
                        variant='outlined'
                        autoFocus
                        required
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                    <TextField
                        id='outlined-password-input'
                        name='password'
                        label='Password'
                        type='password'
                        required
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />


                    <Button type='submit' variant='contained' disabled={isLoading}>
                        Sign Up
                    </Button>

                    {errorMessage && <p>{errorMessage}</p>}
                </form>

                <div className='button-container'>
                    <span>Already have an account?</span>
                    <Link to='/login'>
                        <Button type='submit' variant='contained' color="secondary">Login</Button>
                    </Link>
                </div>

            </div>

        </div>

    );

}

export default Register;