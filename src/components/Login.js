import React from 'react';
import { useState } from 'react';
import axios from 'axios';


const Login = props => {

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
        
        axios.post('http://localhost:8080/login', {
            userName: formData.userName,
            password: formData.password
        })
        .then(response => {
            if (response.status === 200) {
                console.log(response);
           
            // alert('Successfully logged in');
            } else {
              setError('Authentication failed');
            }
        })
        .catch(error => {
            setError(error.message);
        });
    }

    return (
        <>
        <form onSubmit={handleSubmit} action="/login">
        <h1>Lumiére</h1>
        <h2>LOGIN</h2>
            <div>
                <label htmlFor="username">Username</label>
                <input type="text"  placeholder="Type your username" onChange={handleChange} name="userName" value={formData.userName}/>
            </div>
            <div>
            <label htmlFor="password">Password</label>
                <input type="text"  placeholder="Type your password" onChange={handleChange} name="password" value={formData.password}/>   
            </div>
            {error && <span style={{ color: 'red' }}>{error}</span>}
            <button type="submit">LOGIN</button>
            
        </form>    
        </>
    )
}

export default Login;