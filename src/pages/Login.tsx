// LoginPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthProvider';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export type LoginInput = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();

  const handleLogin = async (data: LoginInput) => {
    const res = await axios.post<{ access_token: string }>(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      {
        email: data.email,
        password: data.password,
      }
    );
    

    if (res.data?.access_token) {
      login(res.data.access_token);
      navigate('/catalog');
    } else {
      throw new Error('Login failed');
    }
  };

  const { mutate, isPending, error } = useMutation({
    mutationFn: handleLogin,
  });

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-2xl font-semibold text-center mb-6">Log In</h1>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              {...register('email', { required: true })}
              id="email"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">Email is required</p>}
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-sm text-gray-500 hover:underline"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              {...register('password', { required: true })}
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">Password is required</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 rounded-md text-white font-medium focus:outline-none mb-4"
          >
            {isPending ? 'Logging in...' : 'Log In'}
          </button>

          {error && (
            <p className="text-center text-sm text-red-500 mb-4">
              Invalid email or password.
            </p>
          )}

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
