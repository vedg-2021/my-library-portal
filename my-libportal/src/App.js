import './App.css';
import NavBar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Import the placeholder components
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AboutUs from './pages/AboutUs';
import Librarian from './pages/Librarian';
import AddBook from './pages/AddBook';
import UsersTable from './pages/UsersTable';
import AllBooks from './pages/AllBooks';
import { Button } from '@mui/material';
import UpdateBook from './pages/UpdateBook';
import BorrowsTable from './pages/BorrowsTable';
import BorrowingHistory from './pages/BorrowingHistory';
import UpdateUser from './pages/UpdateUser';
import Admin from './pages/Admin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if there's a token in localStorage (i.e., user is logged in)
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user') || localStorage.removeItem('librarian');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <Router>
      <NavBar />
      <Routes>
        {/* Define routes for your pages */}
        <Route exact path="/" element={<AllBooks />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/about" element={<AboutUs />} />
        <Route exact path="/librarian" element={<Librarian />} />
        <Route exact path="/addbook" element={<AddBook />} />
        <Route exact path="/users" element={<UsersTable />} />
        <Route exact path="/add_librarian" element={<SignUp userType="librarian" />} />
        <Route exact path="/update_book/:id" element={<UpdateBook />} />
        <Route exact path="/borrowing_history" element={<BorrowsTable />} />
        <Route exact path="/borrowing_history/user/:userId" element={<BorrowingHistory />} />
        <Route exact path="/borrowing_history/:userId" element={<BorrowingHistory />} />
        <Route exact path="/update_user/:id" element={<UpdateUser />} />
        <Route exact path="/admin" element={<Admin />} />
      </Routes>
    </Router>
      {/* <h1>Hello World</h1> */}
      <h1>Welcome {
        localStorage.getItem('user')
          ? JSON.parse(localStorage.getItem('user')).name
          : localStorage.getItem('librarian')
          ? JSON.parse(localStorage.getItem('librarian')).name
          : 'Guest'
      }</h1>
      {isAuthenticated ? <Button variant='outlined' onClick={handleLogout}>Logout</Button> : null}
    </div>
  );
}

export default App;
