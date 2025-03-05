import { Lock, LogOut, ShoppingCart, UserPlus, Menu, X, LogIn } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, logout} = useAuthStore();

  const isAdmin = user && user.data?.role === 'admin';

  return (
    <div className='fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
      <div className="container mx-auto px-5 py-4">
        <div className='flex items-center justify-between'>

          {/* Logo */}
          <Link to="/" className='text-2xl font-bold text-emerald-400 flex items-center'>
            E-commerce
          </Link>

          {/* Mobile Menu Button */}
          <button
            className='text-gray-300 lg:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Nav */}
          <nav className='hidden lg:flex items-center gap-6'>
            <Link to="/" className='text-gray-300 hover:text-emerald-400 transition-all'>Home</Link>

            {user && (
              <Link to="/cart" className='relative group flex items-center'>
                <ShoppingCart className='text-gray-300 group-hover:text-emerald-400' size={20} />
                <span className='hidden sm:inline text-gray-300 group-hover:text-emerald-400 ml-1'>Cart</span>
                <span className='absolute -top-2.5 -left-2.5 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition-all duration-300 ease-in-out'>0</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium flex items-center transition-all'
                to="/Admindashboard"
              >
                <Lock className='mr-1' size={18} />
                <span className='hidden sm:inline'>Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition-all'
                onClick={() => logout()}
              >
                <LogOut size={18} />
                <span className='hidden sm:inline ml-2'>Log Out</span>
              </button>
            ) : (
              <>
                <Link to="/signup" className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition-all'>
                  <UserPlus className='mr-2' size={18} />
                  Sign Up
                </Link>
                <Link to="/login" className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition-all'>
                  <LogIn className='mr-2' size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden flex flex-col items-center bg-gray-900/95 border-t border-emerald-800 mt-4 p-4 space-y-3">
            <Link to="/" className='text-gray-300 hover:text-emerald-400 transition-all' onClick={() => setIsMenuOpen(false)}>Home</Link>

            {user && (
              <Link to="/cart" className='relative flex items-center text-gray-300 hover:text-emerald-400' onClick={() => setIsMenuOpen(false)}>
                <ShoppingCart size={20} />
                <span className='ml-1'>Cart</span>
                <span className='absolute -top-1.5 -right-3 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs'>0</span>
              </Link>
            )}

            {isAdmin && (
              <Link className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md flex items-center' to="/Admindashboard" onClick={() => setIsMenuOpen(false)}>
                <Lock className='mr-1' size={18} />
                Dashboard
              </Link>
            )}

            {user ? (
              <button className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center' onClick={() => { logout(); setIsMenuOpen(false) }}>
                <LogOut size={18} />
                <span className='ml-2'>Log Out</span>
              </button>
            ) : (
              <div className='flex justify-center gap-4'>
                <Link to="/signup" className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center' onClick={() => setIsMenuOpen(false)}>
                  <UserPlus className='mr-2' size={18} />
                  Sign Up
                </Link>
                <Link to="/login" className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center' onClick={() => setIsMenuOpen(false)}>
                  <LogIn className='mr-2' size={18} />
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
