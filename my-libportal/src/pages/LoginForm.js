import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Box, Typography, Grid, Alert, Snackbar } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from './AuthContext';

function LoginForm({ userType = "user", loginUrl = "/login", dashboardUrl = "/user-dashboard" }) {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: email,
        password: password,
        type: userType,
      });


      // If login is successful, store the JWT token and user info in localStorage
      localStorage.setItem('token', response.data.token);
      userType === "librarian" ? localStorage.setItem('librarian', JSON.stringify(response.data.librarian)) : userType === "user" ? localStorage.setItem('user', JSON.stringify(response.data.user)) : localStorage.setItem('admin', JSON.stringify(response.data.admin));
      console.log("yyyyyyyyyyyyyyyy",response);
      setIsAuthenticated(true);
      navigate('/');
      setError('');
      setSuccess(response.data.message);


    } catch (error) {
      console.log("error hai yeh", error);
      setSuccess('');
      setError(error.response.data.message);
    }

    setOpenSnackbar(true);
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 8,
            padding: 3,
            border: '1px solid #ccc',
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            {userType === "librarian" ? "Librarian Log In" : userType === "user" ? "User Log In" : "Admin Log In"}
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {/* Email Input */}
            <TextField
              variant="outlined"
              label="Email Address"
              fullWidth
              required
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />

            {/* Password Input */}
            <TextField
              variant="outlined"
              label="Password"
              fullWidth
              required
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>

            {/* Optional: Link to the other login page */}
            <Grid container justifyContent="flex-end">
              <Grid item>
                {userType === "librarian" ? (
                  <Button
                    component={Link}
                    to="/login"
                    color="inherit">
                    Regular User? Log In Here
                  </Button>
                ) : userType === "user" ? (
                  <Button
                    component={Link}
                    to="/signup"
                    color="inherit">
                    Don't have an account? Sign Up
                  </Button>
                ) : (null)}
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{marginTop: '50px'}}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>

    </>
  );
}

export default LoginForm;
