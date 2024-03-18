import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { Box, Button, Container, Grid, InputLabel, SvgIcon, TextField, Typography } from '@mui/material';
import CustomButton from './mui_customization/buttons/CustomButton';
import CustomTextField from './mui_customization/forms/CustomTextField';
import CustomHeading2 from './mui_customization/typography/CustomHeading2';
import Logo from './mui_customization/buttons/Logo';
import LogInPage from '../assets/images/LogInPage.jpg';



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
                    Cookies.set("token", response.data.token);
                    Cookies.set("firstName", response.data.firstName);
                    Cookies.set("photo", response.data.photo);
                    setError(null);
                    onLogin();
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

        <Container component='main' >

            <Grid container>

                <Grid item xs={0} lg={6}
                >
                    {LogInPage}
                    {/* <img src="../assets/images/LogInPage.jpg" height='100px' width='100px' /> */}
                    {/* include image here */}
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Logo />

                    <CustomHeading2 text='Login' />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'left',
                        }}
                    >
                        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }} >

                            <CustomTextField
                                id='username'
                                name='userName'
                                labelText='Email'
                                placeholder='Type your email here'
                                value={formData.userName}
                                onChange={handleChange}
                                required  // Add required attribute
                                error={error && !formData.userName}  // Set error if username is empty
                                helperText={error && !formData.userName && "Username is required"}
                            />

                            <CustomTextField
                                id='password'
                                name='password'
                                labelText='Password'
                                placeholder='Type your password here'
                                value={formData.password}
                                onChange={handleChange}
                                required  // Add required attribute
                                error={error && !formData.password}  // Set error if password is empty
                                helperText={error && !formData.password && "Password is required"}
                            />

                            {error && <span style={{ color: 'red' }}>{error}</span>}

                            <CustomButton text="Login" variant="contained" type="submit" />
                        </Box>
                    </Box>
                </Grid>

            </Grid>

        </Container>
    </>
    )
}

export default Login;

