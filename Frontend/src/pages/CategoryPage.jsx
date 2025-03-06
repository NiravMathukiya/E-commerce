import React, { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryPage = () => {
    const { fetchProductByCategory, products } = useAuthStore();
    const category = useParams().category;

    useEffect(() => {
        fetchProductByCategory(category);
    }, [fetchProductByCategory, category]);

    // Log when categoryProduct updates

    const { user, addToCart } = useAuthStore();
    const handleAddToCart = (product) => {
        if (!user) {
            toast.error("Please login to add products to cart", { id: "cart" });
            return;
        } else {
            // add to cart
            addToCart(product);
        }
    };

    useEffect(() => {
        // console.log('Category Products:', products);
        
    }, [products]);

    return (
        <div className='min-h-screen'>
            <div className='relative z-10  mx-auto sm:px-6 lg:px-8 py-16 max-w-7xl'>
                <motion.h1 className=" text-center text-3xl font-extrabold" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.h1>

                {
                    products.length === 0 && (
                        <motion.h2 className='mt-10 text-2xl text-center font-semibold text-emerald-300' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} >
                            No products found in this category.
                        </motion.h2>
                    )
                }
                <motion.div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  gap-8 mt-8 justify-items-center' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} >
                    {products.length > 0 && products.map((product) => (
                        <div className='flex w-full relative flex-col overflow-hidden rounded-lg border bg-gray-800 border-gray-800 shadow-lg' key={product._id}>
                            <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
                                <img className='object-cover w-full' src={product.image} alt='product image' />
                                {/* <div className='absolute inset-0 bg-black bg-opacity-20' /> */}
                            </div>

                            <div className='mt-4 px-5 pb-5'>
                                <h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
                                <div className='mt-2 mb-5 flex items-center justify-between'>
                                    <p>
                                        <span className='text-3xl font-bold text-emerald-400'>${product.price}</span>
                                    </p>
                                </div>
                                <div className='flex justify-end border-none'>
                                    <button
                                        className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
                                 text-white hover:bg-emerald-700 focus:outline-none '
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        <ShoppingCart size={22} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                </motion.div>


            </div>
        </div>
    );
};

export default CategoryPage;
