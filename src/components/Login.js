import React from 'react';
import { useState } from 'react';
import axios from 'axios';


const Login = ({onLogin}) => {

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
                document.cookie = `token=${response.data.token}; expires=${new Date(Date.now() + 86400e3).toUTCString()}; path=/`;
                setError(null);
                onLogin();
            //  alert('Successfully logged in');
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
        <form onSubmit={handleSubmit}>
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