import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Box, Typography, FormControl, FormHelperText, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateUser() {
    const { id } = useParams();  // Get the book ID from the URL params
    const navigate = useNavigate();  // Used to redirect after update
    const [user, setUser] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        password: '',  // default to true (available)
    });
    const [error, setError] = useState('');
    const [phoneError, setPhoneError] = useState('');


    useEffect(() => {
        // Fetch the book details from the backend based on the id
        const fetchBook = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${id}`);
                setUser(response.data);  // Set the book data to state
            } catch (error) {
                setError('Error fetching book details');
            }
        };

        fetchBook();
    }, [id]);  // Run only when the ID changes (for example, when navigating from one book to another)

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "phone") {
            // Only allow numeric input and ensure it doesn't exceed 10 digits
            if (/[^0-9]/.test(value)) {
                return; // Prevent non-numeric input
            }
            if (value.length > 10) {
                return; // Prevent more than 10 digits
            }
        }


        setUser({
            ...user,
            [name]: value,
        });
    };

    // Handle form submission to update the book details
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (phoneError) return;

        try {
            const response = await axios.put(`http://localhost:3000/update_user/${id}`, user);  // PUT request to update the book
            localStorage.setItem('user', JSON.stringify(response.data));  // Assuming the response has the updated user object
            navigate('/');  // Redirect to the main page after update
        } catch (error) {
            setError('Error updating the book');
        }
    };

    return (
        <Container>
            <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Update User Details
                </Typography>

                {error && <Typography color="error">{error}</Typography>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        required
                    />

                    <TextField
                        label="Email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        fullWidth
                        type="email"
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        required
                    />

                    <TextField
                        label="Phone"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        required
                        inputprops={{
                            inputMode: 'numeric',  // Enable numeric input on mobile
                            pattern: '[0-9]*',      // Only allow numbers in the input field
                            maxLength: 10,          // Restrict input length to 10 digits
                        }}
                    />

                    <TextField
                        label="Address"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        required
                    />

                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ width: '100%', marginTop: 2 }}
                        >
                            Update Book
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
}
