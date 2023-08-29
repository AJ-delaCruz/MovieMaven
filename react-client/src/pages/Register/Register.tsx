import { useState } from "react";
import { backendUrl } from "../../config";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Register = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    // const navigate = useNavigate();


    const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(username);
        try {
            //registers user
            const res = await axios.post(`${backendUrl}/api/auth/register`, {
                username: username,
                password: password
            });

            console.log(res.data);

            // Navigate to login page after successful register
            // navigate('/login');
        } catch (err) {
            console.log(err);
            //set the error message
            // setErrorMessage(err.response.data.message);
        }


    };

    return (

        <div className='grid-box-register'>
            <div className='auth-box-register'>
            </div>

            <div className='form-register'>
                <div className='auth-header'>
                    <h3>Sign up here</h3>
                </div>


                <form onSubmit={submitLogin} className='auth-form'>
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


                    <Button type='submit' variant='contained'>
                        Sign Up
                    </Button>
                    {errorMessage && <p>{errorMessage}</p>}
                </form>

                <div className='button-container'>
                    <span>Already have an account?</span>
                    {/* <Link to='/login'> */}
                        <Button type='submit' variant='contained' color="secondary">Login</Button>
                    {/* </Link> */}
                </div>

            </div>

        </div>

    );

}

export default Register;