import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiShoppingCart, FiDownload,FiTrash2,FiUpload, FiPlus, FiMinus, FiHelpCircle, FiMail,FiHome, FiPhone, FiUser ,FiClipboard} from 'react-icons/fi';
import logo from '../../logo/logo.png';
import {useLocation } from "react-router-dom";
import {  FiCheckCircle } from 'react-icons/fi';
import BACKEND_URL from '../../config';


const GetHelpPopup = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/support/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_email: email,
          user_name: 'Anonymous',
          user_query: query
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          data.message || 'Email sent successfully! Kindly check your email for any feedback.'
        );
        // Optionally clear form
        setEmail('');
        setQuery('');
        // Auto-close after 2 seconds
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send support request.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-white p-6 rounded-lg max-w-md w-full transform transition-all duration-300 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Get Help</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Need to Get Help?</h3>
            <p className="text-sm text-gray-600">
              We provide clients with 24 Hour Support via email. Simply send us an email and we will
              get back to you.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Support Channel:</h4>
            <a
              href="tel:0652421927"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FiPhone className="mr-2" />
              Call Support: 065 242 1927
            </a>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Email Support</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-4">Your Email</label>
                <input
                  type="email"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-green-700 focus:border-transparent"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Query</label>
                <textarea
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-green-700 focus:border-transparent"
                  rows="3"
                  placeholder="Describe your issue..."
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.372 0 0 5.372 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  <FiMail className="inline mr-2" />
                )}
                {loading ? 'Sending...' : 'Send Email'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <FiCheckCircle className="text-green-600 text-4xl mb-2" />
            <p className="text-center text-green-800">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};


const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const location = useLocation(); // Add this import from react-router-dom

  const navigate = useNavigate();

  useEffect(() => {
   const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setFullName(data.full_name);
        } else {
          setFullName("Unknown User");
        }
      } catch (error) {
        console.error("Failed to fetch user info", error);
        setFullName("Unknown User");
      }
    };

    const fetchProfilePicture = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/profile-picture`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data.profile_picture) {
          setProfilePic(data.profile_picture);
        }
      } catch (err) {
        console.error("Error fetching profile picture:", err);
      }
    };

    fetchUserInfo();
    fetchProfilePicture();
  



    const fetchCartItems = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/cart/view`);
    // Convert string prices to numbers
    const cartWithNumbers = response.data.cart.map(item => ({
      ...item,
      price_per_item: Number(item.price_per_item),
      quantity: Number(item.quantity)
    }));
    setCartItems(cartWithNumbers);
    setTotalPrice(Number(response.data.total_price));
  } catch (error) {
    console.error('Error fetching cart items:', error);
    if (error.response?.status === 401) {
      navigate('/login');
    }
  } finally {
    setLoading(false);
  }
};
    fetchCartItems();
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
    navigate('/login');
  };

  const updateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await axios.put(`${BACKEND_URL}/api/cart/update/${bookId}`, { quantity: newQuantity });
      const updatedItems = cartItems.map(item => 
        item.book_id === bookId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (bookId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/cart/remove/${bookId}`);
      const updatedItems = cartItems.filter(item => item.book_id !== bookId);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/cart/clear`);
      setCartItems([]);
      setTotalPrice(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

const calculateTotal = (items) => {
  const total = items.reduce((sum, item) => {
    const price = Number(item.price_per_item || 0);
    const quantity = Number(item.quantity || 0);
    return sum + (price * quantity);
  }, 0);
  setTotalPrice(total);
};

  return (
    <div className="min-h-screen bg-white flex">
      

      <div className="w-64 bg-green-800 text-gray-200 p-4 flex flex-col fixed h-full">
        <div className="flex items-center mb-6 space-x-3 px-4">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded border object-contain" />
          <div className="text-sm font-semibold leading-tight">
            {fullName}
          </div>
        </div>





        <div className="mb-8">
          <div className="border-b border-gray-500 pb-1 mb-3 px-4">
            <h3 className="text-sm uppercase font-semibold">Sections</h3>
          </div>
          <ul>
            <li>
             <button 
                  onClick={() => handleNavigation('/Home')} 
                  className={`w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center ${
                    location.pathname === '/Home' ? 'bg-gray-200 text-green-800' : ''
                  }`}
                >
                <FiHome className="mr-2" />
                Home
              </button>
            </li>
            
            <li>

              <button onClick={() => handleNavigation('/UpdateProfile')} className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center">
                <FiUser className="mr-2" />
                Update Profile
              </button>
            </li>
            <li>
             <button 
                onClick={() => handleNavigation('/cart')} 
                className={`w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center ${
                  location.pathname === '/cart' ? 'bg-gray-200 text-green-800' : ''
                }`}
              >
                <FiShoppingCart className="mr-2" />
                Cart
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/Orders')} className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center">
                <FiClipboard className="mr-2" />
                Orders
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/UploadBook')} className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center">
                <FiUpload className="mr-2" />
                Upload Books
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('/SellerBooks')} 
                className={`w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center ${
                  location.pathname === '/SellerBooks' ? 'bg-gray-200 text-green-800' : ''
                }`}
              >
                <FiDownload className="mr-2" />
                My Books
              </button>
            </li>
            <li>
              <button onClick={() => setShowHelpPopup(true)} className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center">
                <FiHelpCircle className="mr-2" />
                Get Help
              </button>
            </li>
          </ul>
        </div>

        <div className="mt-auto mb-4">
          <div className="border-b border-gray-500 pb-1 mb-3 px-4">
            <h3 className="text-sm uppercase font-semibold">Manage</h3>
          </div>
          <ul>
            <li>
              <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition">
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

     {/* Help Popup */}
      {showHelpPopup && <GetHelpPopup onClose={() => setShowHelpPopup(false)} />}

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 relative">
        <div className="absolute top-4 right-4 z-40">
          <div className="relative">
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors overflow-hidden"
            >
              {profilePic ? (
                <img 
                  src={profilePic} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <FiUser className="text-gray-700 text-xl" />
              )}
            </button>
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button 
                  onClick={() => { handleNavigation('/UpdateProfile'); setShowProfileDropdown(false); }} 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Update Profile
                </button>
                <button 
                  onClick={() => { handleLogout(); setShowProfileDropdown(false); }} 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <FiShoppingCart className="mr-2" />
          Your Shopping Cart
        </h1>

        {loading ? (
          <div className="text-center">Loading your cart...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Your cart is empty</p>
            <button 
              onClick={() => navigate('/home')}
              className="mt-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white shadow-lg p-6 rounded-lg">
              {cartItems.map((item) => (
                <div key={item.book_id} className="border-b pb-4 mb-4 last:border-0">
                  <div className="flex justify-between items-start">
  {/* 👇 Book image */}
  <img 
    src={`/static/uploads/${item.image_path}`} 
    alt={item.title} 
    className="w-24 h-24 object-cover rounded mr-4 border"
  />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
<p className="text-gray-600">R{Number(item.price_per_item || 0).toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border rounded">
                        <button 
                          onClick={() => updateQuantity(item.book_id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                        >
                          <FiMinus />
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.book_id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <p className="font-semibold">R{(Number(item.price_per_item || 0) * Number(item.quantity || 0)).toFixed(2)}</p>

                      <button 
                        onClick={() => removeItem(item.book_id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white shadow-lg p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Total</h3>
                <p className="font-bold text-xl">R{totalPrice.toFixed(2)}</p>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={clearCart}
                  className="flex-1 bg-gray-200 text-black py-2 rounded hover:bg-gray-300 transition-colors flex items-center justify-center"
                >
                  <FiTrash2 className="mr-2" />
                  Clear Cart
                </button>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="flex-1 bg-green-700 text-white py-2 rounded hover:bg-green-800 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Get Help Popup */}
      {showHelpPopup && <GetHelpPopup onClose={() => setShowHelpPopup(false)} />}
    </div>
  );
};

export default CartPage;