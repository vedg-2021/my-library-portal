import './App.css';
import NavBar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Importing the placeholder components
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
import LibrarianTable from './pages/LibrarianTable';
import UpdateLibrarian from './pages/UpdateLibrarian';
import ApproveUsers from './pages/ApproveUsers';
import PendingRequests from './pages/PendingRequests';
import PendingReturnRequests from './pages/PendingReturnRequests';

function App() {

  return (
    <div className="App">
      <Router>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<AllBooks />} />
        <Route exact path="/signup" element={<SignUp />} /> {/* signup for users */}
        <Route exact path="/login" element={<Login />} /> {/* login for users */}
        <Route exact path="/about" element={<AboutUs />} />  {/* About Us Page */}
        <Route exact path="/librarian" element={<Librarian />} /> {/* login for librarian */}
        <Route exact path="/addbook" element={<AddBook />} /> {/* Add a Book available to librarian and admin*/}
        <Route exact path="/users" element={<UsersTable />} /> {/* list of users */}
        <Route exact path="/add_librarian" element={<SignUp userType="admin" />} /> {/* Add librarian available to admin */}
        <Route exact path="/update_book/:id" element={<UpdateBook />} /> {/* Update a book available to librarian and admin*/}
        <Route exact path="/borrowing_history" element={<BorrowsTable />} /> {/* complete borrowing history table */}
        <Route exact path="/borrowing_history/user/:userId" element={<BorrowingHistory />} /> {/* Borrowing history of user (what user sees) */}
        <Route exact path="/borrowing_history/:userId" element={<BorrowingHistory />} />  {/* Borrowing history of a user (what librarian and admin sees) */}
        <Route exact path="/update_user/:id" element={<UpdateUser />} /> {/* Update details of user */}
        <Route exact path="/admin" element={<Admin />} /> {/* login for admin */}
        <Route exact path="/all_librarian" element={<LibrarianTable />} /> {/* All Librarians Table */}
        <Route exact path="/update_librarian/:id" element={<UpdateLibrarian />} /> {/* Update Profile details of librarian */}
        <Route exact path="/unapproved_users" element={<ApproveUsers />} /> {/* Approve user available to librarian and admin */}
        <Route exact path="/pending_requests" element={<PendingRequests />} />
        <Route exact path="/pending_return_requests" element={<PendingReturnRequests />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
