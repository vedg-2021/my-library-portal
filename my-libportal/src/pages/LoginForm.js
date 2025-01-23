import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, Grid, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

function LoginForm({ userType = "user", loginUrl = "/login", dashboardUrl = "/user-dashboard" }) {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);

    // Simulate login logic for user or librarian
    if (userType === "librarian") {
      // For librarian login: hardcoded for now
      if (email === 'librarian@example.com' && password === 'librarian123') {
        setError('');
        setSuccess('Librarian logged in successfully!');
        navigate(dashboardUrl); // Redirect to librarian dashboard
      } else {
        setError('Invalid librarian credentials. Please try again.');
        setSuccess('');
      }
    } else {
      // For user login: hardcoded for now
      if (email === 'user@example.com' && password === 'user123') {
        setError('');
        setSuccess('User logged in successfully!');
        navigate(dashboardUrl); // Redirect to user dashboard
      } else {
        setError('Invalid user credentials. Please try again.');
        setSuccess('');
      }
    }
  };

  return (
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
          {userType === "librarian" ? "Librarian Log In" : "User Log In"}
        </Typography>

        {/* Display error message */}
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Display success message */}
        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {success}
          </Alert>
        )}

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
                <Link to="/login" style={{ color: 'inherit'}}>
                <Button color="inherit">
                  Regular User? Log In Here
                </Button>
                </Link>
              ) : (
                <Link to="/signup" style={{ color: 'inherit'}}>
                <Button color="inherit" href="/signup">
                  Don't have an account? Sign Up
                </Button>
                </Link>
              )}
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default LoginForm;
