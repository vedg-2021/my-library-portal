import React, { useState, useEffect, useContext} from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import AuthContext from '../pages/AuthContext';

function NavBar() {
  const { isAuthenticated, isLibrarian, logout } = useContext(AuthContext);
  // const [username, setUsername] = useState('Guest');  // Default to 'Guest'

  
  // Initialize state directly from localStorage (will get updated after login/logout)
  const getUsername = () => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const librarian = localStorage.getItem('librarian') ? JSON.parse(localStorage.getItem('librarian')) : null;
    return user?.name || librarian?.name || 'Guest';
  };
  
  const [username, setUsername] = useState(getUsername);  // Set initial username
  useEffect(() => {
    const interval = setInterval(() => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const librarian = localStorage.getItem('librarian') ? JSON.parse(localStorage.getItem('librarian')) : null;

    if (user && user.name) {
      setUsername(user.name);  // Set username if user is logged in
    } else if (librarian && librarian.name) {
      setUsername(librarian.name);  // Set username if librarian is logged in
    }}, 1000);

    return () => clearInterval(interval);  // Cleanup interval on unmount

  }, [isAuthenticated, isLibrarian, username]); 


  return (
    <AppBar position="sticky" sx={{backgroundColor: '#6404eb' }}>
      <Toolbar sx={{alignItems: 'center'}}>
        <Container sx={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          {/* Logo or Title */}
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
            LIBRARY PORTAL
          </Typography>
          {/* Navigation Links */}
          {!isAuthenticated ?
            <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/signup">
              Sign Up
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Log In
            </Button>
            <Button color="inherit" component={Link} to="/librarian">
              Librarian
            </Button>
            <Button color="inherit" component={Link} to="/about">
              About Us
            </Button>
            </Box>
            : <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>  
              <Typography>
              {username}
              </Typography>
              {localStorage.getItem('librarian') && (<> 
                <Button color="inherit" component={Link} to="/addbook">Add Book</Button>
                <Button color="inherit" component={Link} to="/users">Users</Button>
              </>)}
              
              {localStorage.getItem('user') && (<> 
                <Button color="inherit" component={Link} to={`/update_user/${JSON.parse(localStorage.getItem('user')).id}`}>Update Profile</Button>
                <Button color="inherit" component={Link} to={`/borrowing_history/${JSON.parse(localStorage.getItem('user')).id}`}>Borrowing History</Button>
              </>)}

              <Button variant='outlined' onClick={logout} sx={{backgroundColor: 'white'}}>Logout</Button>
              </Box>
          }
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
