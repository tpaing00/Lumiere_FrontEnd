import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { Box, Button, Grid, InputLabel, TextField, Typography } from '@mui/material';
import LogInPage from '../assets/images/LogInPage.jpg';
import LogoDesktop from "../assets/logo/logoDesktop.svg";

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

        <Box >

            <Grid container>

                <Grid item xs={0} lg={6}
                    style={{
                        backgroundImage: `url(${LogInPage})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        minHeight: '100vh', // Set a minimum height to cover the entire viewport
                    }}
                >
                </Grid>

                <Grid item xs={12} lg={6} sx={{ display: 'flex', alignContent: 'center' }}>
                    <Box sx={{ padding: { xs: '0 16px', lg: '0' }, maxWidth: { xs: '320px', lg: '396px' }, margin: 'auto' }} >
                        <Box
                            component={LogoDesktop}
                            sx={{
                                width: "100%",
                                height: { xs: 72, lg: 140.76 },
                                p: 0,
                                m: "auto",
                            }}
                        />

                        <Typography component="h1" variant="h1" text="Login"
                            sx={{
                                fontSize: { xs: '24px', lg: '48px' },
                                marginTop: { xs: '30px', lg: '77px' },
                                marginBottom: { xs: '24px', lg: '38px' }
                            }}
                        >
                            Login
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'left'
                            }}
                        >
                            <Box component='form' onSubmit={handleSubmit} >

                                <InputLabel variant="standard" id="username-label"
                                    sx={{
                                        fontSize: { xs: '14px', lg: '16px' }
                                    }}
                                >
                                    Email
                                </InputLabel>
                                <TextField
                                    aria-label="Email"
                                    className='TextField'
                                    id="username"
                                    name="userName"
                                    placeholder="Type your email here"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    fullWidth
                                    required  // Add required attribute
                                    error={error && !formData.userName}  // Set error if username is empty
                                    helperText={error && !formData.userName && "Username is required"}
                                    sx={{ marginBottom: '15px', marginTop: '0' }}
                                />

                                <InputLabel variant="standard" id="password-label"
                                    sx={{
                                        fontSize: { xs: '14px', lg: '16px' }
                                    }}
                                >
                                    Password
                                </InputLabel>
                                <TextField
                                    aria-label="Password"
                                    className='TextField'
                                    id="password"
                                    name="password"
                                    placeholder="Type your password here"
                                    value={formData.password}
                                    onChange={handleChange}
                                    type="password"
                                    fullWidth
                                    required
                                    error={error && !formData.password}  // Set error if password is empty
                                    helperText={error && !formData.password && "Password is required"}
                                />

                                {/* <CustomTextField
                                    id='username'
                                    name='userName'
                                    labelText='Email'
                                    placeholder='Type your email here'
                                    value={formData.userName}
                                    onChangeFunction={handleChange}
                                    required  // Add required attribute
                                    error={error && !formData.userName}  // Set error if username is empty
                                    helperText={error && !formData.userName && "Username is required"}
                                    sx={{ marginBottom: '15px', marginTop: '0' }}
                                /> */}


                                {/* <CustomTextField
                                    id='password'
                                    name='password'
                                    labelText='Password'
                                    placeholder='Type your password here'
                                    value={formData.password}
                                    onChangeFunction={handleChange}
                                    required  // Add required attribute
                                    error={error && !formData.password}  // Set error if password is empty
                                    helperText={error && !formData.password && "Password is required"}
                                /> */}

                                {error && <span style={{ color: 'red' }}>{error}</span>}

                                <Button variant="contained" type="submit"
                                    sx={{ m: 0, mt: {xs: '24px', lg: '37px'}, width: '100%', fontWeight: 'bold' }}
                                >
                                    Login
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

            </Grid>

        </Box>
    </>
    )
}

export default Login;

