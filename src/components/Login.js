import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { Box, Button, Container, TextField, Typography } from '@mui/material';


const Login = ({ onLogin }) => {

    const [formData, setFormData] = useState(
        {
            userName: "",
            password: ""
        }
    );
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('https://api.lumiereapp.ca/api/v1/login', {
            email: formData.userName,
            password: formData.password
        })
            .then(response => {
                if (response.status === 200) {
                    console.log(response);
                    // document.cookie = `token=${response.data.token}; expires=${new Date(Date.now() + 86400e3).toUTCString()}; path=/`;
                    Cookies.set("token", response.data.token);
                    Cookies.set("firstName", response.data.firstName);
                    Cookies.set("photo", response.data.photo);
                    setError(null);
                    onLogin();
                    //alert('Successfully logged in');
                } else {
                    setError('Authentication failed');
                }
            })
            .catch(error => {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    console.error('Error:', error.message);
                }
            });
    }

    return (<>
        <Container align='center' component='main' maxWidth='xs' >
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant='h2' component='h2' sm={12} >
                    Login
                </Typography>

                <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }} >

                    <TextField
                        className='TextField'
                        id='username'
                        label='Username'
                        name='userName'
                        value={formData.userName}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 1 }}
                    />

                    <TextField
                        className='TextField'
                        id='password'
                        label='Password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mt: 1 }}
                    />

                    {error && <span style={{ color: 'red' }}>{error}</span>}
                    <Box ></Box >
                    <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                        LOGIN
                    </Button>
                </Box>
            </Box>
        </Container>
    </>
    )
}

export default Login;