import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader, Mail, Lock } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Login failed! Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className='mx-auto w-full max-w-md'>
        <h2 className="text-center text-3xl font-extrabold text-emerald-400">Login to your account</h2>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className='mx-auto w-full max-w-md'>
        <div className='bg-gray-800 py-8 px-6 mt-5 shadow-md sm:rounded-lg'>
          <form onSubmit={submitHandler} className='space-y-6'>
            {/* Email */}
            <InputField
              id="email"
              label="Email Address"
              type="email"
              icon={<Mail />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            {/* Password */}
            <InputField
              id="password"
              label="Password"
              type="password"
              icon={<Lock />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <button
              type='submit'
              className='w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition duration-150 ease-in-out'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className='mr-2 h-5 w-5 animate-spin' />
                  Loading...
                </>
              ) : (
                <>
                  <ArrowRight className='mr-2 h-5 w-5' />
                  Login
                </>
              )}
            </button>

            <div className='text-center text-sm'>
              <div>Don't have an account? <Link to="/signup" className='text-emerald-400 font-bold'> Register here <ArrowRight className='inline'></ArrowRight></Link>  </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ id, label, type, icon, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300">
      {label}
    </label>
    <div className="relative mt-1">
      <div className="absolute left-3 top-3 h-5 w-5 text-gray-400">{icon}</div>
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default LoginPage;
