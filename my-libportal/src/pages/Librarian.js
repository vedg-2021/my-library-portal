import React from 'react';
import LoginForm from './LoginForm'; // Import the generic LoginForm

function Librarian() {
  return (
    <div>
      <LoginForm 
        userType="librarian" 
      />
    </div>
  );
}

export default Librarian;
