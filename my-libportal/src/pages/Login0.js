import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, Grid, Alert } from '@mui/material';

function Login() {
    // State for form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // For now, just log the values (can be replaced with API call)
        console.log('Email:', email);
        console.log('Password:', password);
        // Simulate API request (for now, we use a mock condition)
        if (email === 'test@example.com' && password === 'password123') {
            // Simulate successful login (you can replace this with an actual API call)
            console.log('Login successful');
            setError('');
        } else {
            // Simulate login error (invalid credentials)
            setError('Invalid credentials. Please try again.');
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
                    Log In
                </Typography>
                {/* Display error message */}
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
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

                    {/* Optional: Link to Sign Up Page */}
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button color="inherit" href="/signup">
                                Don't have an account? Sign Up
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
}

export default Login;
