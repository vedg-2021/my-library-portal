import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardMedia, Stack, Typography, IconButton, Box, Container, Button, Modal, Backdrop, Fade, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function AllBooks() {
    const [error, setError] = useState('');
    const [books, setBooks] = useState([]);
    const [isLibrarian, setIsLibrarian] = useState(false); // To track if the user is a librarian
    const [isAdmin, setIsAdmin] = useState(false); // To track if the user is a librarian
    const [borrowedBooks, setBorrowedBooks] = useState([]); // To track books borrowed by the user
    const [userId, setUserId] = useState(); // Store the logged-in user's ID
    const [selectedBook, setSelectedBook] = useState(null); // Track selected book for the modal
    const [openModal, setOpenModal] = useState(false); // Control modal open/close
    const [searchQuery, setSearchQuery] = useState(''); // State to store search query
    const [filteredBooks, setFilteredBooks] = useState([]);  // Add a state for filtered books
    const maxTitleLength = 35;



    // Fetch books data from the backend
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/');
                setBooks(response.data);  // Save users data to users state we defined above
                setFilteredBooks(response.data);  // Initially, all books are displayed
            } catch (error) {
                setError('Error fetching Books');
            }
        };

        // Check if a librarian is logged in
        const librarian = localStorage.getItem('librarian');
        if (librarian) {
            setIsLibrarian(true); // Set isLibrarian to true if librarian data exists in localStorage
        }
        const admin = localStorage.getItem('admin');
        if (admin) {
            setIsAdmin(true); // Set isLibrarian to true if admin data exists in localStorage
        }
        const token = localStorage.getItem('user'); // Assuming token is saved in localStorage after login
        if (token) {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            setUserId(currentUser.id); // Set the logged-in user's ID
        }

        fetchBooks();
    }, []);

    useEffect(() => {
        if (userId) {
            // Fetch the user's borrowing history
            const fetchBorrowedBooks = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/borrowing_history/${userId}`);
                    setBorrowedBooks(response.data); // Set the books the user has borrowed
                    // Update the books state to reflect the borrowed books
                    setBooks((prevBooks) => prevBooks.map((book) => {
                        const borrowedBook = response.data.find(b => b.book_id === book.id);
                        return borrowedBook ? { ...book, availability_status: false } : book;
                    }));
                } catch (error) {
                    setError('Error fetching borrowing history');
                }
            };

            fetchBorrowedBooks();
        }
    }, [userId]);

    // Search books based on the query
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase(); // Convert search query to lowercase
        setSearchQuery(query);
        if (query === '') {
            setFilteredBooks(books); // If query is empty, show all books
        } else {
            const filtered = books.filter(book =>
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) || book.genre.toLowerCase().includes(query)
            );
            setFilteredBooks(filtered); // Filter books based on title or author
        }
    };

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
            await axios.put(`http://localhost:3000/return_book`, { book_id: bookId, user_id: userId });
            // Update the books list after returning the book
            setBooks(prevBooks =>
                prevBooks.map(book =>
                    book.id === bookId ? { ...book, availability_status: true } : book
                )
            ); // Set the book's availability to true (indicating it is now available)

            // Update the borrowedBooks state to remove the returned book
            setBorrowedBooks(prevBooks =>
                prevBooks.filter(borrowedBook => borrowedBook.book_id !== bookId)
            );

            // Also update filteredBooks if you are using it for displaying results
            setFilteredBooks(prevBooks =>
                prevBooks.map(book =>
                    book.id === bookId ? { ...book, availability_status: true } : book
                )
            );

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
            setBooks((prevBooks) => prevBooks.filter(book => book.id !== bookId));
            setFilteredBooks(prevBooks => prevBooks.filter(book => book.id !== bookId)); // Also update the filtered books state
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
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                <TextField
                    label="Search Books"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearch}
                    sx={{ maxWidth: 500 }}
                />
            </Box>
            <Container>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'stretch',
                    flexWrap: 'wrap',
                    gap: 2,
                    padding: 2,
                }}>
                    {filteredBooks.map((book) => (
                        <Card
                        key={book.id}
                        variant="outlined"
                        sx={{
                            width: { xs: '100%', sm: '250px' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,  // Adjust gap for the new row-based layout
                            padding: 2,
                            minHeight: '200px',  // Ensure there's enough space for all rows
                            boxSizing: 'border-box',
                            borderRadius: 2,
                            cursor: 'pointer',
                        }}
                        onClick={() => handleOpenModal(book)}
                    >
                        {/* Row 1: Book Title */}
                        <Typography
                            color="text.primary"
                            fontWeight="semiBold"
                            sx={{
                                display: '-webkit-box',
                                whiteSpace: 'normal',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2, // Limit to 2 lines and add ellipsis if needed
                                maxWidth: '150px',  // Adjust width to match layout
                                textAlign: 'center',
                            }}
                        >
                            {book.title}
                        </Typography>
                    
                    
                        {/* Row 3: Author Name */}
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="medium"
                            textAlign="center"
                            sx={{ width: '100%', display: 'inline-block' }}
                        >
                            {book.author}
                        </Typography>
                    
                        {/* Row 4: Buttons */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,  // Space between buttons
                            marginTop: 'auto',  // Push buttons to the bottom
                            width: '100%',
                        }}>
                            {/* Admin or Librarian */}
                            {(isLibrarian || isAdmin) ? (
                                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            textTransform: 'none',
                                            width: '48%',
                                            height: '48px',  // Consistent height for the buttons
                                        }}
                                        component={Link}
                                        to={`/update_book/${book.id}`}
                                        onClick={(event) => handleUpdate(book.id, event)}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            textTransform: 'none',
                                            width: '48%',
                                            height: '48px',  // Consistent height for the buttons
                                        }}
                                        onClick={(event) => handleDelete(book.id, event)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    {/* User-specific Buttons (Borrow or Return) */}
                                    {borrowedBooks.some(borrowedBook => borrowedBook.book_id === book.id && borrowedBook.returned_on === null) ? (
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                textTransform: 'none',
                                                width: '100%',  // Full width for Return
                                                height: '48px',  // Consistent height for the buttons
                                                backgroundColor: '#e7ffcd',  // Styling for return button
                                            }}
                                            onClick={(event) => handleReturn(book.id, event)}
                                        >
                                            Return
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled={book.availability_status === false}
                                            variant="outlined"
                                            sx={{
                                                textTransform: 'none',
                                                width: '100%',  // Full width for Borrow
                                                height: '48px',  // Consistent height for the buttons
                                            }}
                                            onClick={(event) => handleBorrow(book.id, event)}
                                        >
                                            {book.availability_status ? 'Borrow' : 'Unavailable'}
                                        </Button>
                                    )}
                                </>
                            )}
                        </Box>
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
                        width: { xs: '90%', sm: 400 }, // 90% width on small screens, 400px on larger ones
                        maxHeight: '80vh', // Prevent the modal from overflowing vertically
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto', // Allow vertical scrolling if content overflows
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
