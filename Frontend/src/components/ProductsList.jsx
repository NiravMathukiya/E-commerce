import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash, Star } from 'lucide-react'
import useAuthStore from '../store/useAuthStore';

const ProductsList = () => {

  const { deleteProduct, products, fetchAllProducts, toggleFeaturedProduct } = useAuthStore();

  // console.log(products)
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);
  return (
    <motion.div className='bg-gray-800 max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <table className='min-w-full divide-y divide-gray-700'>
        <thead className='bg-gray-700'>
          <tr>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
            >
              Product
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
            >
              Price
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
            >
              Category
            </th>

            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
            >
              Featured
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='bg-gray-800 divide-y divide-gray-700'>
          {/* {console.log(Array(products)[0])} */}
          {products.length > 0 && products?.map((product) => (
            <tr key={product._id} className='hover:bg-gray-700'>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0 h-10 w-10'>
                    <img
                      className='h-10 w-10 rounded-full object-cover'
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className='ml-4'>
                    <div className='text-sm font-medium text-white'>{product.name}</div>
                  </div>
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>${product.price.toFixed(2)}</div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>{product.category}</div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <button
                  onClick={() => toggleFeaturedProduct(product._id)}
                  className={`p-1 rounded-full ${product.isFectured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
                    } hover:bg-yellow-500 transition-colors duration-200`}
                >
                  <Star className="h-5 w-5" />
                </button>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className='text-red-400 hover:text-red-300'
                >
                  <Trash className='h-5 w-5' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        {
          products.length <= 0 && (
            <tr className='text-center text-gray-300'>
              <td colSpan='5' className='px-6 py-4 whitespace-nowrap'>
                No products found
              </td>
            </tr>)
        }

      </table>
    </motion.div>
  )
}

export default ProductsList
