// LoginPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    emailOrUsername: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCredentials({
      ...credentials,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: credentials.emailOrUsername,
          password: credentials.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Store token in localStorage or a secure cookie
        localStorage.setItem('token', data.access_token);
        // Redirect to home page
        navigate('/home');
      } else {
        // Handle login error
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-2xl font-semibold text-center mb-6">Log In</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="emailOrUsername">
              Email or username
            </label>
            <input
              id="emailOrUsername"
              name="emailOrUsername"
              type="text"
              value={credentials.emailOrUsername}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <button 
                type="button" 
                onClick={togglePasswordVisibility}
                className="text-sm text-gray-500 flex items-center"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              required
            />
          </div>
          
          <div className="flex items-center mb-6">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={credentials.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700" htmlFor="rememberMe">
              Remember Me
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 rounded-md text-white font-medium focus:outline-none mb-4"
          >
            Log In
          </button>
          
          <div className="text-center">
            <span className="text-gray-600 text-sm">Don't have an account? </span>
            <Link to="/register" className="text-sm font-medium text-black hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;