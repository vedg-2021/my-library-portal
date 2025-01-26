import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardMedia, Stack, Typography, IconButton, Box, Container, Button, Modal, Backdrop, Fade } from '@mui/material';
import { use } from 'react';
import CloseIcon from '@mui/icons-material/Close';

export default function AllBooks() {
    const [paused, setPaused] = React.useState(true);
    const [error, setError] = useState('');
    const [books, setBooks] = useState([]);
    const [isLibrarian, setIsLibrarian] = useState(false); // To track if the user is a librarian
    const [borrowedBooks, setBorrowedBooks] = useState([]); // To track books borrowed by the user
    const [userId, setUserId] = useState(); // Store the logged-in user's ID
    const [selectedBook, setSelectedBook] = useState(null); // Track selected book for the modal
    const [openModal, setOpenModal] = useState(false); // Control modal open/close


    // Fetch users data from the backend
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/');
                setBooks(response.data);  // Save users data to users state we defined above
                // console.log(response.data);
                // setLoading(false);         // Stop loading
            } catch (error) {
                setError('Error fetching Books');
                // setLoading(false);
            }
        };

        // Check if a librarian is logged in
        const librarian = localStorage.getItem('librarian');
        if (librarian) {
            setIsLibrarian(true); // Set isLibrarian to true if librarian data exists in localStorage
        }
        const token = localStorage.getItem('user'); // Assuming token is saved in localStorage after login
        if (token) {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            console.log("user object returned,", currentUser);
            setUserId(currentUser.id); // Set the logged-in user's ID
            console.log("user id we'll send to backend, ", currentUser.id);
        }

        fetchBooks();
    }, []);

    useEffect(() => {
        if (userId) {
          // Fetch the user's borrowing history
      const fetchBorrowedBooks = async () => {
        try {
          console.log("current user,", userId);
          const response = await axios.get(`http://localhost:3000/borrowing_history/${userId}`);
          setBorrowedBooks(response.data); // Set the books the user has borrowed
          console.log("response received,", response.data);
        } catch (error) {
          console.error('Error fetching borrowing history');
          setError('Error fetching borrowing history');
        }
      };

      fetchBorrowedBooks();
    }
  }, [userId]);  

    // Handle Borrow operation
    const handleBorrow = async (bookId, event) => {
        event.stopPropagation(); // Prevent modal from opening
        try {
            await axios.post('http://localhost:3000/borrow_book', { book_id: bookId, user_id: userId, borrowed_on: new Date().toISOString().split('T')[0] });
            setBorrowedBooks(prevBooks => [...prevBooks, { book_id: bookId, returned_on: null }]); // Add the borrowed book to the state
            console.log(borrowedBooks);
        } catch (error) {
            setError('Error borrowing the book');
        }
    };


    // Handle Return operation
    const handleReturn = async (bookId, event) => {
        event.stopPropagation(); // Prevent modal from opening
        try {
            await axios.put(`http://localhost:3000/return_book`, {book_id: bookId, user_id: userId});
            // Update the books list after returning the book
            setBooks(prevBooks => 
                prevBooks.map(book => 
                    book.id === bookId ? { ...book, availability_status: true } : book
                )
            ); // Set the book's availability to true (indicating it is now available)

            setBorrowedBooks(prevBooks => prevBooks.filter(borrowedBook => borrowedBook.book_id !== bookId)); // Remove the book from the borrowed list
        } catch (error) {
            setError('Error returning the book');
        }
    };


    // Handle Delete operation
    const handleDelete = async (bookId, event) => {
        event.stopPropagation(); // Prevent modal from opening
        try {
            // Send delete request to your backend
            await axios.delete(`http://localhost:3000/books/${bookId}`);
            // Remove the deleted book from the UI state
            setBooks(books.filter(book => book.id !== bookId));
        } catch (error) {
            setError('Error deleting the book');
        }
    };

    // Handle Update operation
    const handleUpdate = (bookId, event) => {
        event.stopPropagation(); // Prevent modal from opening
        // You could redirect to the update page here, if needed
    };

        // Open modal with selected book data
        const handleOpenModal = (book) => {
            setSelectedBook(book);
            setOpenModal(true);
        };
    
        // Close modal
        const handleCloseModal = () => {
            setOpenModal(false);
            setSelectedBook(null);
        };
    
    

    return (
        <div>
            <h1>Books</h1>
            <Container>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    flexWrap: 'wrap',
                    gap: 2,
                    padding: 2,
                    // width: { xs: '100%', sm: 'auto' }, // 25% width for sm+ screens, with space for gap
                    // flexDirection: { xs: 'column', sm: 'row', flexWrap: 'wrap' },
                    // // alignItems: 'center',
                    // // borderRadius: 2,
                    // boxSizing: 'border-box'
                }}>
                    {books.map((book) => (
                        <Card
                            key={book.id}
                            variant="outlined"
                            sx={{

                                width: { xs: '100%', sm: '250px' }, // Ensure a fixed width on smaller screens
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                padding: 2,
                                minHeight: '200px',             // Enforce minimum height for all cards
                                boxSizing: 'border-box',        // Ensure padding does not affect card width
                                borderRadius: 2,
                                cursor: 'pointer',
                            }}
                            onClick={() => handleOpenModal(book)} // Open modal on card click
                        >

                            {/* <CardMedia
                            component="img"
                            width="100%"
                            height="auto"
                            alt="Contemplative Reptile album cover"
                            src="/images/harry_potter_book_1.jpg"
                            sx={{
                                width: { xs: '100%', sm: 150 },
                                borderRadius: 2
                            }}
                        /> */}
                            <Stack direction="column" alignItems="center" spacing={1} useFlexGap>
                                <div>
                                    <Typography
                                        color="text.primary"
                                        fontWeight="semiBold"
                                        sx={{
                                            display: 'inline-block',
                                            whiteSpace: 'wrap',
                                            maxWidth: '150px'
                                        }}>
                                        {/* Harry Potter and the Philosopher's Stone */}
                                        {book.title}
                                    </Typography>
                                    <Typography

                                        variant="caption"
                                        color="text.secondary"
                                        fontWeight="medium"
                                        textAlign="center"
                                        sx={{ width: '100%', display: 'inline-block' }}
                                    >
                                        {/* JK Rowling */}
                                        {book.author}
                                    </Typography>
                                </div>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',   // Ensures button is pushed to the bottom
                                    marginTop: 'auto',            // Push button down to the bottom
                                    width: '100%',
                                }}>
                                    {isLibrarian ? (
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    textTransform: 'none',
                                                    width: '48%',
                                                }}
                                                component={Link}
                                                to={`/update_book/${book.id}`} // Link to the update page
                                                onClick={(event) => handleUpdate(book.id, event)} // Prevent modal from opening
                                            >
                                                Update
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    textTransform: 'none',
                                                    width: '48%',
                                                }}
                                                onClick={(event) => handleDelete(book.id, event)} // Trigger delete function
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    ) : (
                                        <>
                                            {borrowedBooks.some(borrowedBook => borrowedBook.book_id === book.id && borrowedBook.returned_on === null) ? (
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        textTransform: 'none',
                                                        width: '100%',
                                                        backgroundColor: '#e7ffcd'
                                                    }}
                                                    onClick={(event) => handleReturn(book.id, event)} // Trigger return function
                                                >
                                                    Return
                                                </Button>
                                            ) : (
                                                <Button
                                                    disabled={book.availability_status === false}
                                                    variant="outlined"
                                                    sx={{
                                                        textTransform: 'none',
                                                        width: '100%',
                                                    }}
                                                    onClick={(event) => handleBorrow(book.id, event)} // Trigger borrow function
                                                >
                                                    {book.availability_status ? 'Borrow' : 'Unavailable'}
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Stack>
                        </Card>
                    ))}
                </Box>
            </Container>
                        {/* Modal for showing book details */}
                        <Modal
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        maxHeight: '80vh',
                        overflow: 'auto',
                    }}>
                        <IconButton
                            onClick={handleCloseModal}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: 'text.primary',
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" component="h2" sx={{ marginBottom: 2 }}>
                            {selectedBook ? selectedBook.title : 'Book Details'}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                            <strong>Author:</strong> {selectedBook ? selectedBook.author : ''}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                            <strong>Genre:</strong> {selectedBook ? selectedBook.genre : ''}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 1 }}>
                            <strong>Publication Date:</strong> {selectedBook ? selectedBook.publication_date : ''}
                        </Typography>
                    </Box>
                </Fade>
            </Modal>

        </div>
    )
}
