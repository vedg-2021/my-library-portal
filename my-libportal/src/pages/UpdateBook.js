import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Box, Typography, FormControl, FormHelperText, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateBook() {
    const { id } = useParams();  // Get the book ID from the URL params
    const navigate = useNavigate();  // Used to redirect after update
    const [book, setBook] = useState({
        title: '',
        author: '',
        publication_date: '',
        genre: '',
        availability_status: true,  // default to true (available)
        isbn: '',
        total_quantity: '',
        price: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        if (!(localStorage.getItem('admin') || localStorage.getItem('librarian'))) {
            navigate('/');
        }
    }, [navigate])
    useEffect(() => {
        // Fetch the book details from the backend based on the id
        const fetchBook = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/books/${id}`);
                setBook(response.data);  // Set the book data to state
            } catch (error) {
                setSuccess('');
                setError('Error fetching book details');
                setOpenSnackbar(true);
            }
        };

        fetchBook();
    }, [id]);  // Run only when the ID changes (for example, when navigating from one book to another)

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({
            ...book,
            [name]: value,
        });
    };

    // Handle form submission to update the book details
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/books/${id}`, book);  // PUT request to update the book
            setError('');
            setSuccess("Details Updated Successfully!")
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate('/');  // Redirect to the main page after update
            }, 2000);
        } catch (error) {
            setSuccess('');
            setError('Error updating the book');
            setOpenSnackbar(true)
        }
    };

    return (
        <>
            <Container>
                <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Update Book
                    </Typography>

                    {error && <Typography color="error">{error}</Typography>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Title"
                            name="title"
                            value={book.title}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                            required
                        />

                        <TextField
                            label="Author"
                            name="author"
                            value={book.author}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                            required
                        />

                        <TextField
                            label="ISBN"
                            name="isbn"
                            value={book.isbn}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                            required
                        />
                        <TextField
                            label="Total Quantity"
                            name="total_quantity"
                            value={book.total_quantity}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                            required
                        />

                        <TextField
                            label="Price"
                            name="price"
                            value={book.price}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                            required
                        />

                        <TextField
                            label="Publication Date"
                            name="publication_date"
                            value={book.publication_date}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            type='date'
                            sx={{ marginBottom: 2 }}
                            required
                        />

                        <FormControl fullWidth required margin="normal">
                            <InputLabel>Genre</InputLabel>
                            <Select
                                value={book.genre}
                                onChange={handleChange}
                                label="Genre"
                                name='genre'
                            >
                                <MenuItem value="Fiction">Fiction</MenuItem>
                                <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
                                <MenuItem value="Science">Science</MenuItem>
                                <MenuItem value="History">History</MenuItem>
                                <MenuItem value="Biography">Biography</MenuItem>
                                <MenuItem value="Fantasy">Fantasy</MenuItem>
                                <MenuItem value="Mystery">Mystery</MenuItem>
                                <MenuItem value="Dystopian">Dystopian</MenuItem>
                                <MenuItem value="Romance">Romance</MenuItem>
                                <MenuItem value="Adventure">Adventure</MenuItem>
                                <MenuItem value="Classic">Classic</MenuItem>
                            </Select>
                            <FormHelperText>Choose a genre</FormHelperText>
                        </FormControl>

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
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ marginTop: '50px' }}
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
