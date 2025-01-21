import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, Grid, Alert } from '@mui/material';
import axios from 'axios';

function SignUp() {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State to manage error messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSuccess('');

    // Make API call to Rails backend
    try {
        const response = await axios.post('http://localhost:3000/signup', {
          user: {
            name,
            email,
            password,
            password_confirmation: confirmPassword,
          },
        });
        
        // If user creation is successful, display success message
        setSuccess(response.data.message);
        console.log('User Info:', response.data.user);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    } catch (error) {
        // If there are errors, display them
        setError(error.response.data.errors.join(', '));
    }

    // Simulate API request (you can replace this with actual backend logic)
    // setTimeout(() => {
    //   // For now, we're simulating a successful sign up
    //   setError('');
    //   setSuccess('Account created successfully!');
    //   console.log('User Info:', { name, email, password });
    // }, 1000);
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
          Sign Up
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
          {/* Name Input */}
          <TextField
            variant="outlined"
            label="Full Name"
            fullWidth
            required
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

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

          {/* Confirm Password Input */}
          <TextField
            variant="outlined"
            label="Confirm Password"
            fullWidth
            required
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>

          {/* Optional: Link to Login Page */}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button color="inherit" href="/login">
                Already have an account? Log In
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default SignUp;
