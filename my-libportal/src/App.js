import './App.css';
import NavBar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import the placeholder components
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AboutUs from './pages/AboutUs';
import Librarian from './pages/Librarian';
import AddBook from './pages/AddBook';
import UsersTable from './pages/UsersTable';
import AllBooks from './pages/AllBooks';

function App() {
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
      </Routes>
    </Router>
      {/* <h1>Hello World</h1> */}
    </div>
  );
}

export default App;
