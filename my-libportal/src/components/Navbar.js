// import React, { useState, useEffect, useContext} from 'react';
// import { AppBar, Toolbar, Typography, Button, Container, Box, useMediaQuery, Drawer, IconButton } from '@mui/material';
// import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
// import MenuIcon from '@mui/icons-material/Menu';
// import AuthContext from '../pages/AuthContext';

// function NavBar() {
//   const { isAuthenticated, isLibrarian, isAdmin, logout } = useContext(AuthContext);
//   // const [username, setUsername] = useState('Guest');  // Default to 'Guest'
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   // Use Material-UI's useMediaQuery to check if the screen size is small (e.g., mobile view)
//   const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));



//   // Initialize state directly from localStorage (will get updated after login/logout)
//   const getUsername = () => {
//     const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
//     const librarian = localStorage.getItem('librarian') ? JSON.parse(localStorage.getItem('librarian')) : null;
//     const admin = localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')) : null;
//     return user?.name || librarian?.name || admin?.name || 'Guest';
//   };

//   const [username, setUsername] = useState(getUsername);  // Set initial username
//   useEffect(() => {
//     const interval = setInterval(() => {
//     const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
//     const librarian = localStorage.getItem('librarian') ? JSON.parse(localStorage.getItem('librarian')) : null;
//     const admin = localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')) : null;

//     if (user && user.name) {
//       setUsername(user.name);  // Set username if user is logged in
//     } else if (librarian && librarian.name) {
//       setUsername(librarian.name);  // Set username if librarian is logged in
//     }else if(admin && admin.name) {
//       setUsername(admin.name); // Set username if admin is logged in
//     }}, 1000);

//     return () => clearInterval(interval);  // Cleanup interval on unmount

//   }, [isAuthenticated, isLibrarian, isAdmin, username]); 

//   const handleDrawerToggle = () => {
//     setDrawerOpen(!drawerOpen);
//   };

//   // Function to close the drawer after a button click
//   const handleButtonClick = () => {
//     setDrawerOpen(false);  // Close the drawer
//   };


//   const renderNavLinks = () => (
//     <>
//       {!isAuthenticated ? (
//         <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
//           <Button color="inherit" component={Link} to="/signup" onClick={handleButtonClick}>Sign Up</Button>
//           <Button color="inherit" component={Link} to="/login" onClick={handleButtonClick}>Log In</Button>
//           <Button color="inherit" component={Link} to="/librarian" onClick={handleButtonClick}>Librarian</Button>
//           <Button color="inherit" component={Link} to="/about" onClick={handleButtonClick}>About Us</Button>
//         </Box>
//       ) : (
//         <Box sx={{ display: 'flex', alignItems: 'center' ,flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
//           <Typography>{username}</Typography>
//           { localStorage.getItem('librarian') && (
//             <>
//               <Button color="inherit" component={Link} to={`/update_librarian/${JSON.parse(localStorage.getItem('librarian')).id}`} onClick={handleButtonClick}>Update Profile</Button>
//             </>
//           )}
//           {(localStorage.getItem('librarian') || localStorage.getItem('admin')) && (
//             <>
//               <Button color="inherit" component={Link} to="/addbook" onClick={handleButtonClick}>Add Book</Button>
//               <Button color="inherit" component={Link} to="/users" onClick={handleButtonClick}>Users</Button>
//               <Button color="inherit" component={Link} to="/pending_requests" onClick={handleButtonClick}>Borrows</Button>
//               <Button color="inherit" component={Link} to="/pending_return_requests" onClick={handleButtonClick}>Returns</Button>
//               <Button color="inherit" component={Link} to="/unapproved_users" onClick={handleButtonClick}>Approvals</Button>
//             </>
//           )}
//           {localStorage.getItem('admin') && (
//             <Button color="inherit" component={Link} to="/all_librarian" onClick={handleButtonClick}>Librarian</Button>
//           )}
//           {localStorage.getItem('user') && (
//             <>
//               <Button color="inherit" component={Link} to={`/update_user/${JSON.parse(localStorage.getItem('user')).id}`} onClick={handleButtonClick}>Update Profile</Button>
//               <Button color="inherit" component={Link} to={`/borrowing_history/${JSON.parse(localStorage.getItem('user')).id}`} onClick={handleButtonClick}>Borrowing History</Button>
//             </>
//           )}
//           <Button variant="outlined" onClick={logout} sx={{ backgroundColor: 'white' }}>Logout</Button>
//         </Box>
//       )}
//     </>
//   );



//   return (
//     <AppBar position="sticky" sx={{backgroundColor: '#6404eb' }}>
//       <Toolbar sx={{alignItems: 'center'}}>
//         <Container sx={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
//           {/* Logo or Title */}
//           <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
//             LIBRARY PORTAL
//           </Typography>
//           {/* Navigation Links */}

//           {/* Render a hamburger menu on small screens */}
//           {isMobile ? (
//             <>
//               <IconButton color="inherit" onClick={handleDrawerToggle}>
//                 <MenuIcon />
//               </IconButton>

//               <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
//                 <Box sx={{ width: 250, padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
//                   {renderNavLinks()}
//                 </Box>
//               </Drawer>
//             </>
//           ) : (
//             renderNavLinks()
//           )}
//         </Container>
//       </Toolbar>
//     </AppBar>
//   );
// }

// export default NavBar;


//////////////////////////////////////////////


import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, useMediaQuery, Drawer, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AuthContext from '../pages/AuthContext';

function NavBar() {
  const { isAuthenticated, isLibrarian, isAdmin, logout } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Get username from localStorage
  const getUsername = () => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const librarian = localStorage.getItem('librarian') ? JSON.parse(localStorage.getItem('librarian')) : null;
    const admin = localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')) : null;
    return user?.name || librarian?.name || admin?.name || 'Guest';
  };

  const [username, setUsername] = useState(getUsername);

  useEffect(() => {
    const interval = setInterval(() => {
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      const librarian = localStorage.getItem('librarian') ? JSON.parse(localStorage.getItem('librarian')) : null;
      const admin = localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')) : null;

      if (user && user.name) {
        setUsername(user.name);
      } else if (librarian && librarian.name) {
        setUsername(librarian.name);
      } else if (admin && admin.name) {
        setUsername(admin.name);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isLibrarian, isAdmin]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleButtonClick = () => {
    setDrawerOpen(false);
  };

  // Render buttons inside the drawer
  const renderNavLinks = () => (
    <Box sx={{ width: 250, padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">{username}</Typography>

      {!isAuthenticated ? (
        <>
          <Button color="inherit" component={Link} to="/signup" onClick={handleButtonClick}>Sign Up</Button>
          <Button color="inherit" component={Link} to="/login" onClick={handleButtonClick}>Log In</Button>
          <Button color="inherit" component={Link} to="/librarian" onClick={handleButtonClick}>Librarian</Button>
          <Button color="inherit" component={Link} to="/about" onClick={handleButtonClick}>About Us</Button>
        </>
      ) : (
        <>
          {localStorage.getItem('librarian') && (
            <Button color="inherit" component={Link} to={`/update_librarian/${JSON.parse(localStorage.getItem('librarian')).id}`} onClick={handleButtonClick}>Update Profile</Button>
          )}
          {(localStorage.getItem('librarian') || localStorage.getItem('admin')) && (
            <>
              <Button color="inherit" component={Link} to="/addbook" onClick={handleButtonClick}>Add Book</Button>
              <Button color="inherit" component={Link} to="/users" onClick={handleButtonClick}>Users</Button>
              <Button color="inherit" component={Link} to="/borrowing_history" onClick={handleButtonClick}>Borrowing History</Button>
              <Button color="inherit" component={Link} to="/pending_requests" onClick={handleButtonClick}>Borrows</Button>
              <Button color="inherit" component={Link} to="/pending_return_requests" onClick={handleButtonClick}>Returns</Button>
              <Button color="inherit" component={Link} to="/unapproved_users" onClick={handleButtonClick}>Approvals</Button>
            </>
          )}
          {localStorage.getItem('admin') && (
            <Button color="inherit" component={Link} to="/all_librarian" onClick={handleButtonClick}>Librarian</Button>
          )}
          {localStorage.getItem('user') && (
            <>
              <Button color="inherit" component={Link} to={`/update_user/${JSON.parse(localStorage.getItem('user')).id}`} onClick={handleButtonClick}>Update Profile</Button>
              <Button color="inherit" component={Link} to={`/borrowing_history/${JSON.parse(localStorage.getItem('user')).id}`} onClick={handleButtonClick}>Borrowing History</Button>
            </>
          )}
          <Button variant="outlined" onClick={logout} sx={{ backgroundColor: 'white' }}>Logout</Button>
        </>
      )}
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#6404eb' }}>
      <Toolbar sx={{ alignItems: 'center' }}>
        <Container sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo or Title */}
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
            LIBRARY PORTAL
          </Typography>

        {/* Right side: Username & Menu Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated && (
            <Typography sx={{ fontWeight: 'bold' }}>
              {username}
            </Typography>
          )}

          {/* Menu icon to open the drawer */}
          <IconButton color="inherit" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          </Box>
          

          {/* Left-side Drawer */}
          <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
            {renderNavLinks()}
          </Drawer>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
