import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, MenuItem, Select, InputLabel, FormControl, FormHelperText } from '@mui/material';

function AddBook() {
  // State to manage form inputs
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [genre, setGenre] = useState('');
  const [availability, setAvailability] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!title || !author || !publicationDate || !genre || !availability) {
      setError('All fields are required.');
      return;
    }

    setError('');

    // Simulate adding book (this would typically be an API call)
    const newBook = {
      title,
      author,
      publicationDate,
      genre,
      availability,
    };

    // You can log the book details or send them to your backend here
    console.log('New Book Added:', newBook);

    // Reset form fields
    setTitle('');
    setAuthor('');
    setPublicationDate('');
    setGenre('');
    setAvailability('');
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
            value={publicationDate}
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
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              label="Availability"
            >
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Checked Out">Checked Out</MenuItem>
              <MenuItem value="Reserved">Reserved</MenuItem>
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
