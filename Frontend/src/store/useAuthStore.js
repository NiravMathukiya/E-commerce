import { create } from 'zustand';
import axiosInstance from '../utils/axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
const useAuthStore = create(
    (set, get) => ({
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
                console.log("hello")
                await axiosInstance.post("/cart", { productId: product._id });
                toast.success("Product added to cart");

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
            } catch (error) {
                toast.error(error.response?.data.message || "An error occurred");
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
                const res = await axiosInstance.get("/cart");
                // console.log(res)
                set({ cart: res.data });
                get().calculateTotals();
            } catch (error) {
                set({ cart: [] });
                // toast.error(error.response?.data.message || "An error occurred");
            }
        },
        getMyCoupon: async () => {
            try {
                const response = await axiosInstance.get("/coupons");
                console.log(response.data)
                set({ coupon: response.data });
            } catch (error) {
                console.error("Error fetching coupon:", error);
            }
        },
        applyCoupon: async (code) => {
            try {
                const response = await axiosInstance.post("/coupons/validate", { code });
                set({ coupon: response.data, isCouponApplied: true });
                get().calculateTotals();
                toast.success("Coupon applied successfully");
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to apply coupon");
            }
        },
        removeCoupon: () => {
            set({ coupon: null, isCouponApplied: false });
            get().calculateTotals();
            toast.success("Coupon removed");
        },

        
        clearCart: async () => {
            set({ cart: [], coupon: null, total: 0, subtotal: 0 });
        },
        addToCart: async (product) => {
            try {
                await axiosInstance.post("/cart", { productId: product._id });
                toast.success("Product added to cart");

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
            } catch (error) {
                toast.error(error.response.data.message || "An error occurred");
            }
        },
        removeFromCart: async (productId) => {
            await axiosInstance.delete(`/cart`, { data: { productId } });
            set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
            get().calculateTotals();
        },
        updateQuantity: async (productId, quantity) => {
            if (quantity === 0) {
                get().removeFromCart(productId);
                return;
            }

            await axiosInstance.put(`/cart/${productId}`, { quantity });
            set((prevState) => ({
                cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
            }));
            get().calculateTotals();
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
        updateQuantity: async (productId, quantity) => {
            if (quantity === 0) {
                get().removeFromCart(productId);
                return;
            }

            await axiosInstance.put(`/cart/${productId}`, { quantity });
            set((prevState) => ({
                cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
            }));
            get().calculateTotals();
        },
        getMyCoupon: async () => {
            try {
                const response = await axiosInstance.get("/coupons");
                set({ coupon: response.data });
            } catch (error) {
                console.error("Error fetching coupon:", error);
            }
        },
        applyCoupon: async (code) => {
            try {
                const response = await axiosInstance.post("/coupons/validate", { code });
                set({ coupon: response.data, isCouponApplied: true });
                get().calculateTotals();
                toast.success("Coupon applied successfully");
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to apply coupon");
            }
        },
        removeCoupon: () => {
            set({ coupon: null, isCouponApplied: false });
            get().calculateTotals();
            toast.success("Coupon removed");
        },

        clearCart: async () => {
            set({ cart: [], coupon: null, total: 0, subtotal: 0 });
        },
        removeFromCart: async (productId) => {
            await axiosInstance.delete(`/cart`, { data: { productId } });
            set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
            get().calculateTotals();
        },
    }),

);

export default useAuthStore;
