import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, MenuItem, Select, InputLabel, FormControl, FormHelperText, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddBook() {
  // State to manage form inputs
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publication_date, setPublicationDate] = useState('');
  const [genre, setGenre] = useState('');
  const [availability_status, setAvailability] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [open, setOpen] = useState(true);
  const navigate = useNavigate(); // Use history hook for navigation


  useEffect(() => {

    // Check if the user is a librarian or admin; if not, redirect to home
    const userRole = localStorage.getItem('librarian') || localStorage.getItem('admin');
    if (!userRole){
      navigate('/'); // Redirect to home or another page
    }

    if (success) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, 5000); // Success dissapears after 5 seconds

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [success]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!title || !author || !publication_date || !genre || !availability_status) {
      setError('All fields are required.');
      return;
    }

    setError('');

    // Simulate adding book (this would typically be an API call)
    const newBook = {
      title,
      author,
      publication_date,
      genre,
      availability_status,
    };

    // You can log the book details or send them to your backend here
    setSuccess('New Book Added!');
    setOpen(true);
    try {
      const response = await axios.post('http://localhost:3000/add_book', { book: newBook });
      setSuccess(response.data.message);
      // Reset form fields
      setTitle('');
      setAuthor('');
      setPublicationDate('');
      setGenre('');
      setAvailability('');
    } catch (error) {
      setError(error.response.data.errors.join(', '));
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
          Add New Book
        </Typography>

        {/* Display error message */}
        {error && (
          <Typography variant="body2" color="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Typography>
        )}

        {open && success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Title Input */}
          <TextField
            variant="outlined"
            label="Title"
            fullWidth
            required
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Author Input */}
          <TextField
            variant="outlined"
            label="Author"
            fullWidth
            required
            margin="normal"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          {/* Publication Date Input */}
          <TextField
            variant="outlined"
            label="Publication Date"
            fullWidth
            required
            margin="normal"
            type="date"
            value={publication_date}
            onChange={(e) => setPublicationDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Genre Select */}
          <FormControl fullWidth required margin="normal">
            <InputLabel>Genre</InputLabel>
            <Select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              label="Genre"
            >
              <MenuItem value="Fiction">Fiction</MenuItem>
              <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
              <MenuItem value="Science">Science</MenuItem>
              <MenuItem value="History">History</MenuItem>
              <MenuItem value="Biography">Biography</MenuItem>
              <MenuItem value="Fantasy">Fantasy</MenuItem>
              <MenuItem value="Mystery">Mystery</MenuItem>
            </Select>
            <FormHelperText>Choose a genre</FormHelperText>
          </FormControl>

          {/* Availability Status Select */}
          <FormControl fullWidth required margin="normal">
            <InputLabel>Availability</InputLabel>
            <Select
              value={availability_status}
              onChange={(e) => setAvailability(e.target.value)}
              label="Availability"
            >
              <MenuItem value="true">Available</MenuItem>
              <MenuItem value="false">Borrowed</MenuItem>
            </Select>
            <FormHelperText>Choose availability status</FormHelperText>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
          >
            Add Book
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AddBook;
