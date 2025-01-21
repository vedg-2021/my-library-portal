import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

function NavBar() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Container sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo or Title */}
          <Typography variant="h6">
            Library Portal
          </Typography>
          {/* Navigation Links */}
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
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
