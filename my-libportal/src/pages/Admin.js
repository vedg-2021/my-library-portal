import React from 'react';
import LoginForm from './LoginForm'; // Import the generic LoginForm

function Admin() {
  return (
    <div>
      <LoginForm 
        userType="admin" 
      />
    </div>
  );
}

export default Admin;
