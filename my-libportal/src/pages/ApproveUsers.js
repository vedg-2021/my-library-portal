import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';



export default function ApproveUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Check if the user is librarian or admin; if not, redirect to home
    useEffect(() => {
    const userRole = localStorage.getItem('librarian') || localStorage.getItem('admin');
    if (!userRole){
        navigate('/'); // Redirect to home or another page
    }
    }, []);


    // Fetch all users who are not approved
    useEffect(() => {
        const fetchUnApprovedUsers = async () => {
            try {
            const response = await axios.get('http://localhost:3000/unapproved_users');
            console.log(response.data.users);
            setUsers(response.data.users);  // Save users data to users state we defined above
            console.log(response.data);
            } catch (error) {
            setError('Error fetching users');
            }
        };

        fetchUnApprovedUsers();
    }, []);


    const handleApprove = async (userId) => {
        try{
        const response = await axios.put('http://localhost:3000/approve_user', {id: userId, is_approved: true});
        setSuccess(response.data.message);
        setUsers(users.filter(user => user.id !== userId));
        console.log(response);
        } catch(error) {
            console.log(error);
        }
    };
    

    

  return (
    <div>
        <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Pending Approval
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
      {(
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Action</TableCell>
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
                    //   to={`/borrowing_history/${user.id}`} // Assuming you have a page to show the borrowing history
                      onClick={() => handleApprove(user.id)}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                    <IconButton
                      color="secondary"
                    //   onClick={() => handleDelete(user.id)} // Trigger delete function
                    onClick={() => console.log('delete pressed')}
                    > 
                    <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
    </div>
  )
}
