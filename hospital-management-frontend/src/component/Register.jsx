import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const navigate=useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;
    return re.test(String(email).toLowerCase());
  };

  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]+$/; 
    return regex.test(name) && name.trim().length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!validateName(name)) {
      toast.error('Please enter a valid name.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address ending with .com or .in.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    try {
       await axios.post('http://localhost:4000/api/users/register', 
        { 
        name, 
        email, 
        password, 
        role: 'patient', 
      });
      
      setName('');
      setEmail('');
      setPassword('');
      
      toast.success('Registered successfully! Redirecting to login...');

      setTimeout(() => {
        // window.location.href = '/login'; 
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-100 to-blue-300">
      <ToastContainer position="top-center" autoClose={3000} />
      <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded-lg shadow-md w-82 space-y-4">
        <h2 className="text-3xl font-semibold text-center mb-4">Create an Account</h2>
        
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Register</button>
        
        <p className="text-center text-gray-600">
          Already have an account? <a href="/login" className="tSext-blue-500 hover:underline">Login here</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
