import React from 'react';
import LoginForm from './LoginForm'; // Import the generic LoginForm

function Login() {
  return (
    <div>
      <LoginForm 
        userType="user" 
        // loginUrl="/login" 
        // dashboardUrl="/user-dashboard" 
      />
    </div>
  );
}

export default Login;
