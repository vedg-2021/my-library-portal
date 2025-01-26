import React from 'react';
import LoginForm from './LoginForm'; // Import the generic LoginForm

function Login() {
  return (
    <div>
      <LoginForm 
        userType="user" 
      />
    </div>
  );
}

export default Login;
