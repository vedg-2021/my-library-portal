import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Card, CardMedia, Stack, Typography, IconButton, Box, Container, Button } from '@mui/material';

export default function AllBooks() {
    const [paused, setPaused] = React.useState(true);
    const [error, setError] = useState('');
    const [books, setBooks] = useState([]);

    // Fetch users data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/');
        setBooks(response.data);  // Save users data to users state we defined above
        console.log(response.data);
        // setLoading(false);         // Stop loading
      } catch (error) {
        setError('Error fetching users');
        // setLoading(false);
      }
    };

    fetchUsers();
  }, []); 

    return (
        <div>
            <h1>Books</h1>
            <Container>
                <Box sx={{
                    p: 2,
                    width: { xs: '100%', sm: 'auto' }, // 25% width for sm+ screens, with space for gap
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row', flexWrap: 'wrap' },
                    // alignItems: 'center',
                    gap: 2,
                    // borderRadius: 2,
                    boxSizing: 'border-box'
                }}>
                    {books.map((book) => (
                    <Card
                        key={book.id}
                        variant="outlined"
                        sx={{
                            p: 2,
                            width: { xs: '100%', sm: 'auto' },
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row'},
                            alignItems: 'center',
                            gap: 2,
                            borderRadius: 2,
                        }}
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
                            <Stack direction="row" alignItems="center" spacing={1} useFlexGap>
                                <Button disabled={book.availability_status === true ? false : true} variant="outlined">{book.availability_status === true ? "Borrow" : "Unavailable"}</Button>
                            </Stack>
                        </Stack>
                    </Card>
                    ))}
                </Box>
            </Container>
        </div>
    )
}
