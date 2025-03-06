import { create } from 'zustand';
import axiosInstance from '../utils/axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
const useAuthStore = create(
    (set,get) => ({
        user: null,
        checkingAuth: false,
        error: null,
        loading: false,
        products: [],
        cart: [],
        coupon: null,
        total: 0,
        subTotal: 0,


        // Login Function
        login: async (email, password) => {
            try {

                const response = await axiosInstance.post(`/auth/login`, { email, password });

                set({ user: response.data.data });
                // console.log('Login Response:', response.data.data);

                return response.data;
            } catch (error) {
                console.error('Login Error:', error.response?.data?.message || error.message);
                throw new Error(error.response?.data?.message || 'Login failed.');
            }
        },

        // Signup Function
        signup: async (name, email, password) => {
            try {
                const response = await axiosInstance.post(`/auth/signup`, { name, email, password });

                // console.log('Signup Response:', response.data);

                if (response.status === 200) {
                    set({ user: response.data });
                    return response.data;
                } else {
                    throw new Error('Signup failed.');
                }
            } catch (error) {
                console.error('Signup Error:', error.response?.data?.message || error.message);
                throw new Error(error.response?.data?.message || 'Signup failed.');
            }
        },

        // Logout Function (Optional)
        logout: () => {
            try {
                axiosInstance.post(`/auth/logout`);
                set({ user: null })
                return true;
            } catch (error) {
                toast.error('Logout failed.');
            }
        },


        checkAuth: async () => {
            set({ checkingAuth: true });

            try {
                  
                const response = await axiosInstance.get(`/auth/profile`);

                set({
                    checkingAuth: false,
                    user: response.data
                });
                // console.log('Check Auth Response:', response.data);

                return response.data;
            } catch (error) {
                // toast.error(`Check Auth Error: ${error.response?.data?.message || error.message}`);

                set({
                    checkingAuth: false,
                    user: null
                });
                // console.clear();
            }
        },

        createProduct: async (productData) => {
            set({ loading: true });
            try {
                const response = await axiosInstance.post('/products/create', productData);
                // console.log('Product Created:', response.data);
                toast.success('Product created successfully.');
                return response.data;
            } catch (error) {
                console.error('Product Creation Error:', error.response?.data?.message || error.message);
                throw new Error(error.response?.data?.message || 'Product creation failed.');
            }
            finally {
                set({ loading: false });
            }
        },

        fetchAllProducts: async () => {
            try {
                const response = await axiosInstance.get('/products');
                // console.log(response.data.products);
                set({ products: response.data.products });

                // console.log('All Products:', response.data);
            } catch (error) {
                toast.error('Failed to fetch products.');
                console.error(
                    'Fetch All Products Error:',
                    error.response?.data?.message || error.message
                );
            }
        },


        toggleFeaturedProduct: async (productId) => {
            set({ loading: true });
            try {
                const response = await axiosInstance.patch(`/products/${productId}`);
                // console.log(response.data.updatedProduct);

                set((state) => ({
                    products: state.products.map((product) =>
                        product._id === productId
                            ? { ...product, isFectured: response.data.updatedProduct.isFectured } // Corrected key
                            : product
                    ),
                    loading: false,
                }));

                toast.success('Featured Product Change  successfully.');
            } catch (error) {
                set({ loading: false });
                toast.error(error.response?.data?.message || "Failed to update product");
            }
        },

        fetchProductByCategory: async (category) => {
            set({ loading: true });
            try {
                const response = await axiosInstance.get(`/products/category/${category}`);
                console.log()
                set({ products: response.data.products });
                set({ loading: false });
            } catch (error) {
                set({ loading: false });
                toast.error('Failed to fetch products by category.');
                console.error('Fetch Products by Category Error:', error.response?.data?.message || error.message);
            }
        },

        deleteProduct: async (productId) => {
            try {
                const response = await axiosInstance.delete(`/products/${productId}`);

                toast.success('Product deleted successfully.');

                set((state) => ({
                    products: state.products.filter((product) => product._id !== productId),
                }));

                return response.data;
            } catch (error) {
                toast.error('Product deletion failed.');
                console.error(
                    'Product Deletion Error:',
                    error.response?.data?.message || error.message
                );
            }
        },

        addToCart: async (product) => {
            try {
                const response = await axiosInstance.post('/cart', { productId: product._id });
                set((prevState) => {
                    const existingItem = prevState.cart.find((item) => item._id === product._id);
                    const newCart = existingItem
                        ? prevState.cart.map((item) =>
                            item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                        )
                        : [...prevState.cart, { ...product, quantity: 1 }];
                    return { cart: newCart };
                });
                get().calculateTotals();
                toast.success('Product added to cart successfully.');
            } catch (error) {
                toast.error('Failed to add product to cart.');
                console.error('Add to Cart Error:', error.response?.data?.message || error.message);
            }
        },
        calculateTotals: () => {
            const { cart, coupon } = get();
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            let total = subtotal;

            if (coupon) {
                const discount = subtotal * (coupon.discountPercentage / 100);
                total = subtotal - discount;
            }

            set({ subtotal, total });
        },

        getCartItems: async () => {
            try {
                const response = await axiosInstance.get('/cart');
                set({ cart: response.data.cart });
                return response.data;
            } catch (error) {
                set({ cart: [] });
                console.error('Get Cart Items Error:', error.response?.data?.message || error.message);
            }
        },

    }),

);

export default useAuthStore;
