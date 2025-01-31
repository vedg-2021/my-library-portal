import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // To access URL params
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';

function BorrowingHistory() {
  const { userId } = useParams(); // Extract user ID from the URL
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // console.log("hello", localStorage.getItem('user'));
    const userRole = localStorage.getItem('librarian') || localStorage.getItem('admin');

    if(!userRole){
      if (localStorage.getItem('user')){
        if(JSON.parse(localStorage.getItem('user')).id === userId)
        return;
      } else{
        navigate('/');
      }

    }
  }, []);


  // Fetch user's borrowing history when the component mounts
  useEffect(() => {
    const fetchBorrowingHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/borrowing_history/user/${userId}`);
        console.log("API Response:", response);
        setUserName(response.data[0].user.name);
        // Sort the borrowing history so that books that have not been returned come first
        const sortedHistory = response.data.sort((a, b) => {
            // If "returned_on" is null for a record, it should come first
            if (!a.returned_on && b.returned_on) return -1;
            if (a.returned_on && !b.returned_on) return 1;
            return 0;  // If both have the same return status (either both null or both not null)
          });
        
        if (response.data.message) {
          setError(response.data.message);  // Handle case where no borrowing history exists
        } else {
          setBorrowingHistory(sortedHistory);  // Set borrowing history data
        }
        setLoading(false); // Stop loading
      } catch (error) {
        setError('User has not borrowed any books');
        setLoading(false);
      }
    };

    fetchBorrowingHistory();
  }, [userId]);  // Re-run the effect when userId changes

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Borrowing History for User: {userName}
      </Typography>

      {/* Display error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
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
                <TableCell>Book Title</TableCell>
                <TableCell>Borrowed On</TableCell>
                <TableCell>Returned On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrowingHistory.map((record) => {
                // Check if the book is not returned (i.e., returned_on is null)
                const isNotReturned = !record.returned_on;

                return (
                  <TableRow 
                    key={record.id} 
                    sx={{
                      backgroundColor: isNotReturned ? 'rgba(255, 0, 0, 0.1)' : 'transparent', // Highlight in red if not returned
                      color: isNotReturned ? 'red' : 'inherit', // Change text color to red if not returned
                    }}
                  >
                    <TableCell>{record.book.title}</TableCell>
                    <TableCell>{new Date(record.borrowed_on).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {isNotReturned ? 'Not Returned' : new Date(record.returned_on).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default BorrowingHistory;
