import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Box, Typography, FormControl, FormHelperText, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateLibrarian() {
    const { id } = useParams();  // Get the book ID from the URL params
    const navigate = useNavigate();  // Used to redirect after update
    const [librarian, setLibrarian] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        password: '',  // default to true (available)
    });
    const [error, setError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [success, setSuccess] = useState(setSuccess);


    if(!(localStorage.getItem('librarian'))) navigate('/');

    useEffect(() => {
        // Fetch the book details from the backend based on the id
        const fetchLibrarian = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/librarian/${id}`);
                setLibrarian(response.data);  // Set the book data to state
            } catch (error) {
                setError('Error fetching book details');
            }
        };

        fetchLibrarian();
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


        setLibrarian({
            ...librarian,
            [name]: value,
        });
    };

    // Handle form submission to update the book details
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (phoneError) return;

        try {
            const response = await axios.put(`http://localhost:3000/update_librarian/${id}`, librarian);  // PUT request to update the book
            localStorage.setItem('librarian', JSON.stringify(response.data));  // Assuming the response has the updated librarian object
            setError('');
            setSuccess("Librarian Details Updated Successfully");
            setOpenSnackbar(true);
            setTimeout(() => {navigate('/');}, 2000);
        } catch (error) {
            setError('Error updating Librarian Details');
        }
    };

    return (
        <>
        <Container>
            <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Update Librarian Details
                </Typography>


                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        name="name"
                        value={librarian.name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        required
                    />

                    <TextField
                        label="Email"
                        name="email"
                        value={librarian.email}
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
                        value={librarian.phone}
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
                        value={librarian.address}
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
                            Update
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>

        <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={error ? 'error' : success}
                    sx={{ width: '100%' }}
                    >
                        { error || success }
                    </Alert>
            </Snackbar>
        </>
    );
}
