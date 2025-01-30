import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // To access URL params
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Button, Link, Snackbar } from '@mui/material';

function BorrowingHistory() {
    const { userId } = useParams(); // Extract user ID from the URL
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Fetch user's borrowing history when the component mounts
    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await axios.get('http://localhost:3000/pending_requests');
                console.log("API Response:", response);
                // Sort the borrowing history so that books that have not been returned come first
                const sortedHistory = response.data.sort((a, b) => {
                    // If "returned_on" is null for a record, it should come first
                    if (!a.returned_on && b.returned_on) return -1;
                    if (a.returned_on && !b.returned_on) return 1;
                    return 0;  // If both have the same return status (either both null or both not null)
                });

                if (response.data.message) {
                    setError(response.data.message);
                } else {
                    setPendingRequests(sortedHistory);
                }
                setLoading(false); // Stop loading
            } catch (error) {
                setError('User has not borrowed any books');
                setLoading(false);
            }
        };

        fetchPendingRequests();
    }, [userId]);  // Re-run the effect when userId changes


    const handleApprove = async (recordId, bookId, userId) => {
        try {
            const response = await axios.put('http://localhost:3000/approve_borrow', { recordid: recordId, book_id: bookId, user_id: userId, request_is_approved: true });
            console.log(response.data.message);
            // After approval, remove the record from the list
            setPendingRequests((prevRequests) => prevRequests.filter(request => request.id !== recordId));
            setSuccess('Borrow Approved!');
            setOpenSnackbar(true);
        } catch (error) {
            console.log(error.response.data.message);
        }
    };

    return (
        <>
            <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Pending Approvals
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
                                    <TableCell>User Id</TableCell>
                                    <TableCell>Member's Name</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingRequests.map((record) => {
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
                                            {/* <TableCell>{new Date(record.borrowed_on).toLocaleDateString()}</TableCell> */}
                                            <TableCell>{record.user_id}</TableCell>
                                            <TableCell>{record.user.name}</TableCell>
                                            <TableCell>
                                                {/* {isNotReturned ? 'Not Returned' : new Date(record.returned_on).toLocaleDateString()} */}
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    // component={Link}
                                                    // to={`/borrowing_history/${user.id}`} // Assuming you have a page to show the borrowing history
                                                    onClick={() => handleApprove(record.id, record.book.id, record.user.id)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                // onClick={() => handleDelete(user.id)} // Trigger delete function
                                                >
                                                    Reject
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
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

export default BorrowingHistory;
