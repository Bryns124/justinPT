import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('api/auth/register', { name, email, password });
    } catch (error) {
      // Redirect to login page
      console.error('Registration error: ', error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Register form elements */}
    </form>
  )
}