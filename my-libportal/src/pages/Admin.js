import React from 'react';
import LoginForm from './LoginForm'; // Import the generic LoginForm

function Admin() {
  return (
    <div>
      <LoginForm 
        userType="admin" 
        // loginUrl="/login" 
        // loginUrl="/librarian" 
        // dashboardUrl="/librarian-dashboard" 
      />
    </div>
  );
}

export default Admin;
