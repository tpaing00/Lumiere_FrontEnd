import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return ( 
        <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/scanner">Quick Scan</Link></li>  
            <li><Link to="/register">Register</Link></li>  
        </ul>
    </nav>  
  );
};

export default NavBar;