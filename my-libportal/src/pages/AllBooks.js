import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardMedia, Stack, Typography, IconButton, Box, Container, Button, Modal, Backdrop, Fade, TextField, Chip, Snackbar, Alert, RadioGroup, Radio, FormControlLabel, Pagination } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { useNavigate } from 'react-router-dom';
import { addDays, format } from 'date-fns';


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
    const [allBorrowedBooks, setAllBorroweBooks] = useState([]);  // Add a state for filtered books
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [success, setSuccess] = useState('');
    const [searchResultMessage, setSearchResultMessage] = useState('');
    const [searchFilter, setSearchFilter] = useState('all'); // Default filter is 'author'
    const navigate = useNavigate();
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 16;

    // Calculate indexes for slicing books
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const displayedBooks = filteredBooks.slice(startIndex, endIndex);


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

        const fetchAllBorrowedBooks = async () => {
            try {
                const all_borrowed_response = await axios.get('http://localhost:3000/all_borrowed');
                setAllBorroweBooks(all_borrowed_response.data);
            } catch (error) {
                console.log("Not able to fetch all borrowed books from borrowed table because: ", error);
            }
        };

        fetchBooks();
        fetchAllBorrowedBooks();
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

    // Handles the search when the button is clicked
    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setFilteredBooks(books);
            setSearchResultMessage(''); // Clear message if search is empty
            return;
        }

        let filtered = [];
        if (searchFilter === 'author') {
            filtered = books.filter(book =>
                book.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResultMessage(`Here are all the books from author "${searchQuery}"`);
        } else if (searchFilter === 'genre') {
            filtered = books.filter(book =>
                book.genre.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResultMessage(`Here are all the books in genre "${searchQuery}"`);
        } else if (searchFilter === 'all') {
            filtered = books.filter(book =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.genre.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResultMessage(`Here are all the books matching "${searchQuery}"`);
        }

        // If no books match, show "No books found" message
        if (filtered.length === 0) {
            setSearchResultMessage(`No books found matching "${searchQuery}"`);
        }

        setFilteredBooks(filtered);
    };



    const handleBorrow = async (bookId, event) => {
        event.stopPropagation(); // Prevent modal from opening

        if (localStorage.getItem('user')) {

            // Immediately update the UI: Show "Borrow Approval Pending"
            setBorrowedBooks(prevBooks => [
                ...prevBooks,
                { book_id: bookId, borrowed_on: null, returned_on: null, request_is_approved: false }
            ]);

            // Immediately update the book availability in UI
            setBooks(prevBooks =>
                prevBooks.map(book =>
                    book.id === bookId ? { ...book, availability_status: false } : book
                )
            );

            try {
                const response = await axios.post('http://localhost:3000/borrow_book', {
                    book_id: bookId,
                    user_id: userId
                });

                console.log("Borrow request response:", response);

            } catch (error) {
                setError('Error borrowing the book');
                console.log("Error borrowing the book:", error);
            }
        } else {
            navigate('/login');
        }
    };

    const handleReturn = async (bookId, event) => {
        event.stopPropagation(); // Prevent modal from opening

        const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format

        // Immediately update the UI to show "Return Approval Pending"
        setBorrowedBooks(prevBooks => {
            const updatedBorrowedBooks = prevBooks.map(book =>
                ((book.book_id === bookId) && (book.is_rejected === false))
                    ? { ...book, return_is_approved: false, returned_on: today }  // Mark as pending
                    : book
            );
            console.log("Updated Borrowed Books (Before API Call):", updatedBorrowedBooks);
            return updatedBorrowedBooks;
        });

        try {
            const response = await axios.put(`http://localhost:3000/return_book`, {
                book_id: bookId,
                user_id: userId
            });

            console.log("Return request sent successfully:", response);

        } catch (error) {
            setError('Error returning the book');
            console.log("Error returning the book:", error);
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
            setError('');
            setSuccess('Book Deleted Successfully!');
            setOpenSnackbar(true);
        } catch (error) {
            setSuccess('');
            // console.log(error);
            setError(error.response.data.error);
            setOpenSnackbar(true);
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

    // Handle page change
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <>
            <div>
                <h1>Books</h1>


                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                            label="Search Books"
                            variant="outlined"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                flexGrow: 1,
                                width: { xs: '300px', sm: '400px', md: '500px' }
                            }}
                        />
                        {/* Search icon button */}
                        <IconButton
                            onClick={handleSearch}
                            sx={{ backgroundColor: '#6404eb', color: 'white', '&:hover': { backgroundColor: '#1565c0' } }}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Box>

                    {/* Radio buttons for search type */}
                    <RadioGroup
                        row
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                    >
                        <FormControlLabel
                            control={<Radio sx={{
                                color: 'black', // Default color
                                '&.Mui-checked': { color: '#6404eb' } // Color when selected
                            }} />}
                            value="all" label="All" />
                        <FormControlLabel value="author" control={<Radio sx={{
                            color: 'black', // Default color
                            '&.Mui-checked': { color: '#6404eb' } // Color when selected
                        }} />} label="Author" />
                        <FormControlLabel value="genre" control={<Radio sx={{
                            color: 'black', // Default color
                            '&.Mui-checked': { color: '#6404eb' } // Color when selected
                        }} />} label="Genre" />
                    </RadioGroup>


                    {/* Display search result message */}
                    {searchResultMessage && (
                        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                            {searchResultMessage}
                        </Typography>
                    )}
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
                        {displayedBooks.map((book) => (
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

                                {localStorage.getItem('librarian') ? `current: ${book.current_quantity}` :
                                    null
                                }


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
                                            {borrowedBooks.find(borrowedBook => borrowedBook.book_id === book.id && borrowedBook.borrowed_on === null) ? (
                                                'Borrow Approval Pending'
                                            ) : (borrowedBooks.find(borrowedBook => borrowedBook.book_id === book.id &&
                                                borrowedBook.borrowed_on !== null &&
                                                borrowedBook.returned_on !== null &&
                                                borrowedBook.request_is_approved === true &&
                                                borrowedBook.return_is_approved === false) ? (
                                                'Return Approval Pending'
                                            ) : (borrowedBooks.find(borrowedBook => borrowedBook.book_id === book.id &&
                                                borrowedBook.borrowed_on !== null &&
                                                borrowedBook.request_is_approved === true &&
                                                borrowedBook.return_is_approved === false) ? (
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

                                                <>
                                                    {book.availability_status ? <Button
                                                        disabled={book.availability_status === false}
                                                        variant="outlined"
                                                        sx={{
                                                            textTransform: 'none',
                                                            width: '100%',  // Full width for Borrow
                                                            height: '48px',  // Consistent height for the buttons
                                                        }}
                                                        onClick={(event) => handleBorrow(book.id, event)}
                                                    >
                                                        Borrow
                                                    </Button> : <Box sx={{
                                                        display: 'flex',
                                                        // flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        height: '48px',
                                                        gap: 1,  // Space between buttons
                                                        marginTop: 'auto',  // Push buttons to the bottom
                                                        width: '100%',
                                                    }}>
                                                        {book.availability_status ? null :
                                                            (() => {
                                                                // Find the borrowed book entry
                                                                const borrowedBook = allBorrowedBooks.find(b => b.book_id === book.id && b.returned_on === null);

                                                                console.log("HELLO", borrowedBook)

                                                                let label = 'Available on: ';  // Default label if not borrowed

                                                                if (borrowedBook) {
                                                                    // If borrowed, calculate the "Available on" date (7 days after borrowed_on)
                                                                    const borrowedDate = new Date(borrowedBook.borrowed_on); // Convert borrowed_on to Date object
                                                                    const availableDate = addDays(borrowedDate, 7); // Add 7 days
                                                                    label = `Available on: ${format(availableDate, 'MMM dd, yyyy')}`; // Format and set the label
                                                                }

                                                                return (
                                                                    <Chip
                                                                        size="small"
                                                                        variant="outlined"
                                                                        icon={<InfoRoundedIcon />}
                                                                        label={label}  // Use the precomputed label
                                                                        sx={(theme) => {
                                                                            const isDarkMode = theme.palette.mode === 'light';
                                                                            return {
                                                                                display: 'flex',
                                                                                // alignItems: 'center',  // Ensures text is centered vertically
                                                                                justifyContent: 'center',  // Centers content horizontally
                                                                                fontSize: '0.875rem',  // Matches button text size
                                                                                padding: '6px 8px',  // Keeps chip compact
                                                                                height: '32px',  // Keeps the default small chip height
                                                                                lineHeight: '32px',  // Aligns text properly
                                                                                verticalAlign: 'middle',  // Helps with alignment in flex containers
                                                                                // marginTop: 'auto',
                                                                                '.MuiChip-icon': { fontSize: 16, ml: '4px', color: isDarkMode ? '#4caf50' : '#388e3c' },
                                                                                bgcolor: !isDarkMode ? '#2c6b29' : '#c8e6c9',
                                                                                borderColor: !isDarkMode ? '#1b5e20' : '#81c784',
                                                                                color: !isDarkMode ? '#c8e6c9' : '#2c6b29',
                                                                            };
                                                                        }}
                                                                    />
                                                                );
                                                            })()
                                                        }

                                                    </Box>
                                                    }
                                                </>
                                            )))}
                                        </>
                                    )}
                                </Box>
                            </Card>


                        ))}
                    </Box>
                    {/* Pagination Component */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={Math.ceil(filteredBooks.length / booksPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            sx={{
                                '& .MuiPaginationItem-root': { color: 'black' }, // Change page number color
                                '& .Mui-selected': { backgroundColor: '#6404eb', color: 'white' }, // Selected page styling
                                '& .MuiPaginationItem-root:hover': { backgroundColor: '#ddd' } // Hover effect                    
                            }}
                        />
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
                                <strong>ISBN:</strong> {selectedBook ? selectedBook.isbn : ''}
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
