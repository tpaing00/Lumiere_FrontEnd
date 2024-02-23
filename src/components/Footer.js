import React from 'react';

const Footer = ({loggedIn, onLogout}) => {
  return (
    <footer>
        {loggedIn && <button onClick={onLogout}>Logout</button>}
    </footer>
  );
}

export default Footer;