import React from 'react';
import LoginForm from './LoginForm'; // Import the generic LoginForm

function Librarian() {
  return (
    <div>
      <LoginForm 
        userType="librarian" 
        loginUrl="/login" 
        // loginUrl="/librarian" 
        dashboardUrl="/librarian-dashboard" 
      />
    </div>
  );
}

export default Librarian;
