import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Alert, Button, Fab, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';  // Import the Add icon


function LibrarianTable() {
  // State to hold the users data, loading state, and error messages
  const [libs, setLibs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Use history hook for navigation
  const [openSnackbar, setOpenSnackbar] = useState(false);


  // Check if the user is librarian or admin; if not, redirect to home
  useEffect(() => {
    const userRole = localStorage.getItem('admin');
    if (!userRole){
      navigate('/'); // Redirect to home or another page
    }
  }, []);


  // Fetch users data from the backend
  useEffect(() => {
    const fetchLibrarians = async () => {
      try {
        const response = await axios.get('http://localhost:3000/all_librarian');
        setLibs(response.data);  // Save users data to users state we defined above
        console.log(response.data);
        setLoading(false);         // Stop loading
      } catch (error) {
        setSuccess('');
        setError('Error fetching users');
        setOpenSnackbar(true);
        setLoading(false);
      }
    };

    fetchLibrarians();
  }, []);  // The empty array ensures the effect runs only once after the component mounts


  // Handle delete operation
  const handleDelete = async (id) => {
    try {
      // Send delete request to your backend
      await axios.delete(`http://localhost:3000/delete_librarian/${id}`);
      // Remove the deleted user from the UI state
      setLibs(libs.filter(user => user.id !== id));
      setError('');
      setSuccess('Librarian deleted successfully');
      setOpenSnackbar(true);
    } catch (error) {
      setSuccess('');
      setError('Error deleting user');
      setOpenSnackbar(true);
    }
  };

  // Navigate to the add librarian form
  const handleAddLibrarian = () => {
    navigate('/add_librarian');
  };


  return (
    <>
    <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Librarians List
      </Typography>

      {/* Display error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Show loading spinner while fetching data */}
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {libs.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(user.id)} // Trigger delete function
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Floating action button to add librarian */}
      <Fab 
        color="primary" 
        aria-label="add" 
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: '#6404eb',
          '&:hover': {
            backgroundColor: '#3d00b0', // Color on hover (adjust as needed)
            },
        }}
        onClick={handleAddLibrarian}
      >
        <AddIcon />
      </Fab>
    </Container>

    <Snackbar 
      open={openSnackbar}
      autoHideDuration={3000}
      onClose={() => setOpenSnackbar(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={() => setOpenSnackbar(false)}
        severity={error ? 'error' : 'success'}
        sx={{ width: '100%'}}
        >
          {error || success}
        </Alert>
    </Snackbar>

    </>
  );
}

export default LibrarianTable;
