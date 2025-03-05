import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader, Mail, User, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { signup, user } = useAuthStore();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password and Confirm Password should be the same.');
      return;
    }

    setLoading(true);

    try {
      const newUser = await signup(formData.name, formData.email, formData.password);

      if (newUser) {
        navigate('/login');
      }
    } catch (error) {
      toast.error('Signup failed! Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col justify-center px-6 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='mx-auto w-full max-w-md'
      >
        <h2 className="text-center text-3xl font-extrabold text-emerald-400">
          Create an Account
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='mx-auto mt-6 w-full max-w-md'
      >
        <div className='bg-gray-800 py-8 px-6 shadow-md sm:rounded-lg'>
          <form onSubmit={submitHandler} className='space-y-6'>
            {/* Full Name */}
            <InputField
              id="name"
              label="Full Name"
              type="text"
              icon={<User />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
            />

            {/* Email */}
            <InputField
              id="email"
              label="Email Address"
              type="email"
              icon={<Mail />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
            />

            {/* Password */}
            <InputField
              id="password"
              label="Password"
              type="password"
              icon={<Lock />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />

            {/* Confirm Password */}
            <InputField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              icon={<Lock />}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition duration-150 ease-in-out"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Sign up
                </>
              )}
            </button>

            <div className="text-center text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 hover:underline">
                Login here <ArrowRight className="inline" size={18} />
              </Link>
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

export default SignupPage;
