import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Alert, Button, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UsersTable() {
  // State to hold the users data, loading state, and error messages
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate(); // Use history hook for navigation

  // Check if the user is librarian or admin; if not, redirect to home
  useEffect(() => {
    const userRole = localStorage.getItem('librarian') || localStorage.getItem('admin');
    if (!userRole) {
      navigate('/'); // Redirect to home or another page
    }
  }, []);


  // Fetch users data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users');
        setUsers(response.data);  // Save users data to users state we defined above
        console.log(response.data);
        setLoading(false);         // Stop loading
      } catch (error) {
        setSuccess('');
        setError('Error fetching users');
        setOpenSnackbar(true);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);  // The empty array ensures the effect runs only once after the component mounts


  // Handle delete operation
  const handleDelete = async (userId) => {
    try {
      // Send delete request to your backend
      await axios.delete(`http://localhost:3000/users/${userId}`);
      // Remove the deleted user from the UI state
      setUsers(users.filter(user => user.id !== userId));
      setError('');
      setSuccess('User deleted successfully');
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Users List
        </Typography>

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
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        component={Link}
                        to={`/borrowing_history/${user.id}`} // Assuming you have a page to show the borrowing history
                        sx={{ mr: 1 }}
                      >
                        Borrowing History
                      </Button>
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
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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

export default UsersTable;
