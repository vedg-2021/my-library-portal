import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, Grid, Alert } from '@mui/material';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp({ userType="user" }) {
    // State for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();  // Use navigate hook for navigation

    // State to manage error messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // when admin and librarian is not logged in redirect to home
    console.log("usertype ========> ",userType);
    useEffect(() => {
        if(!(localStorage.getItem('admin')) && userType === 'admin'){
        // const userRole = localStorage.getItem('admin') || localStorage.getItem('librarian');
        // if (!userRole){
            navigate('/'); // Redirect to home or another page
        // }
    }
    }, []);

    const handleChange = (e) => {
        // Regex to allow only digits
        const regex = /^[0-9]{0,10}$/;  // Only digits allowed
        const inputValue = e.target.value;

        // If the input matches the regex (only digits), update the phone state
        if (regex.test(inputValue)) {
            setPhone(inputValue);
        }
    };

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
            const response = await axios.post(userType === "user" ? 'http://localhost:3000/signup' : 'http://localhost:3000/add_librarian', {
                [userType==="user" ? "user" : "librarian"]: {
                    name,
                    email,
                    phone,
                    address,
                    password,
                    password_confirmation: confirmPassword,
                },
            });

            // If user creation is successful, display success message
            setSuccess(response.data.message);
            if(userType==='user'){
                console.log('User Info:', response.data.user);
            } else{
                console.log('Librarian Info:', response.data.librarian);
            }

            setName('');
            setEmail('');
            setPhone('');
            setAddress('')
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            // Log the error for debugging purposes
        console.error('Error during form submission:', error);

        // Check if error.response and error.response.data are defined
        if (error.response && error.response.data && Array.isArray(error.response.data.errors)) {
            setError(error.response.data.errors.join(', '));
        } else {
            setError('An unexpected error occurred.');
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
                    {userType === "user" ? "Sign Up" : "Add a Librarian"}
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

                    {/* Phone Number */}
                    <TextField
                        variant="outlined"
                        label="Phone Number"
                        fullWidth
                        required
                        type="tel"
                        margin="normal"
                        value={phone}
                        onChange={handleChange}
                    />

                    {/* Address */}
                    <TextField
                        variant="outlined"
                        label="Address"
                        fullWidth
                        margin="normal"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    {/* Password Input */}
                    <TextField
                        variant="outlined"
                        label={userType==="user" ? "Password" : "Initial Password"}
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
                        { userType==="user" ? "Sign Up" : "Add"}
                    </Button>

                    {/* Optional: Link to Login Page */}
                    {userType==="user" ? <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/login" style={{ color: 'inherit' }}>
                                <Button color="inherit">
                                    Already have an account? Log In
                                </Button>
                            </Link>
                        </Grid>
                    </Grid> : ""}
                </form>
            </Box>
        </Container>
    );
}

export default SignUp;
