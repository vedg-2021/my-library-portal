import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Alert, Button } from '@mui/material';

function UsersTable() {
  // State to hold the users data, loading state, and error messages
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  // Fetch users data from the backend
  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const response = await axios.get('http://localhost:3000/borrowing_history');

        const sortedHistory = response.data.sort((a, b) => {
          // If "returned_on" is null for a record, it should come first
          if (!a.returned_on && b.returned_on) return -1;
          if (a.returned_on && !b.returned_on) return 1;
          return 0;  // If both have the same return status (either both null or both not null)
        });

        setBorrows(sortedHistory);  // Save users data to users state we defined above
        console.log(response.data);
        setLoading(false);         // Stop loading
      } catch (error) {
        setError('Error fetching users');
        setLoading(false);
      }
    };

    fetchBorrows();
  }, []);  // The empty array ensures the effect runs only once after the component mounts


  // Handle delete operation
  const handleDelete = async (userId) => {
    try {
      // Send delete request to your backend
      await axios.delete(`http://localhost:3000/users/${userId}`);
      // Remove the deleted user from the UI state
      setBorrows(borrows.filter(user => user.id !== userId));
      setSuccess('User deleted successfully');
    } catch (error) {
      setError('Error deleting user');
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Borrowing History
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
                <TableCell>Book Id</TableCell>
                <TableCell>Book Name</TableCell>
                <TableCell>Borrower Id</TableCell>
                <TableCell>Borrower Name</TableCell>
                <TableCell>Borrowed On</TableCell>
                <TableCell>Returned On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrows.map((record) => (
                <TableRow key={record.id} sx={{backgroundColor: (record.returned_on === null ? 'rgba(255, 0, 0, 0.1)' : 'transparent')}}>
                  <TableCell>{record.book_id}</TableCell>
                  <TableCell>{record.book.title}</TableCell>
                  <TableCell>{record.user_id}</TableCell>
                  <TableCell>{record.user.name}</TableCell>
                  <TableCell>{record.borrowed_on}</TableCell>
                  <TableCell>{record.returned_on === null ? "Not Returned" : record.returned_on}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default UsersTable;
