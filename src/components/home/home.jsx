import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiLogOut, FiSearch, FiFilter, FiX, FiMapPin, FiPlay, FiX as FiClose } from 'react-icons/fi';
import logo from '../../logo/logo.png';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FiShoppingCart, FiHelpCircle, FiDownload, FiUser, FiHome,
  FiMail, FiPhone, FiUpload, FiClipboard
} from "react-icons/fi";

import BACKEND_URL from '../../config';

import {  FiCheckCircle } from 'react-icons/fi';



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


const VideoPreviewModal = ({ videoPath, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`relative w-full max-w-4xl transform transition-all duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}>
        <button 
          onClick={handleClose} 
          className="absolute -top-10 right-0 text-white hover:text-gray-300 text-3xl"
        >
          &times;
        </button>
        <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
          <video 
            controls 
            autoPlay 
            className="w-full h-full object-contain"
            src={`${videoPath}`}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

const SellerBooks = () => {
  const [fullName, setFullName] = useState('');
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [loadingOwner, setLoadingOwner] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    area: '',
  });
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [videoToPreview, setVideoToPreview] = useState(null);
 const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
          withCredentials: true
        });
        if (response.data) {
          setFullName(response.data.full_name || "User");
        }
      } catch (error) {
        console.error("Failed to fetch user info", error);
        setFullName("User");
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

    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/books/all`, {
          withCredentials: true
        });
        setBooks(res.data);
        setFilteredBooks(res.data);
        
        const uniqueCategories = [...new Set(res.data.map(book => book.category))];
        const uniqueAreas = [...new Set(res.data.map(book => book.area))];
        
        setCategories(uniqueCategories);
        setAreas(uniqueAreas);
      } catch (err) {
        console.error('Error fetching books:', err);
        alert('Failed to fetch your uploaded books.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePicture();
    fetchUserInfo();
    fetchBooks();
  }, []);

  const handleSearchAndFilter = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('name', searchTerm);
      if (filters.category) params.append('category', filters.category);
      if (filters.area) params.append('area', filters.area);
      
      const res = await axios.get(`${BACKEND_URL}/api/books/all/filter?${params.toString()}`, {
        withCredentials: true
      });
      
      setFilteredBooks(res.data);
    } catch (err) {
      console.error('Error filtering books:', err);
      alert('Failed to filter books.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      area: '',
    });
    setFilteredBooks(books);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      navigate('/LandingPage');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

const handleAddToCart = async (bookId) => {
  try {
    await axios.post(`${BACKEND_URL}/api/cart/add`, { book_id: bookId }, { withCredentials: true });
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000); // auto hide after 2 sec
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Failed to add book to cart');
  }
};


  const handleViewDetails = async (book) => {
    setSelectedBook(book);
    setLoadingOwner(true);
    
    try {
      const response = await axios.get(`${BACKEND_URL}/api/books/${book.id}/owner`, {
        withCredentials: true
      });
      setOwnerDetails(response.data);
    } catch (error) {
      console.error('Error fetching owner details:', error);
      setOwnerDetails(null);
    } finally {
      setLoadingOwner(false);
    }
  };

  const handleClosePopup = () => {
    setSelectedBook(null);
    setOwnerDetails(null);
  };

  const BookDetailsPopup = ({ book, onClose, ownerDetails, onAddToCart }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{book.name}</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiClose className="text-xl" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {book.image_path && (
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL || `${BACKEND_URL}`}/api/books/uploads/${book.image_path}`}
                    alt={book.name}
                    className="w-full rounded-lg mb-4"
                  />
                )}
                
                <div className="space-y-3">
                  
                  
                  <div>
                    <h3 className="font-semibold text-gray-700">Price</h3>
                    <p className="text-green-700 font-bold">R{book.price || '0.00'}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700">Category</h3>
                    <p className="text-gray-600">{book.category || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700">Location</h3>
                    <p className="text-gray-600">{book.area || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-l pl-6">
                <h3 className="text-xl font-semibold mb-4">Seller Information</h3>
                
                {ownerDetails ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      {ownerDetails.profile_picture ? (
                        <img 
                          src={ownerDetails.profile_picture} 
                          alt="Seller" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <FiUser className="text-gray-500 text-xl" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium">{ownerDetails.name} {ownerDetails.surname}</h4>
                        <p className="text-gray-600 text-sm">{ownerDetails.email}</p>
                      </div>
                    </div>
                    
                    {ownerDetails.cell && (
                      <div>
                        <h4 className="font-medium text-gray-700">Contact Number</h4>
                        <p className="text-gray-600">{ownerDetails.cell}</p>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => onAddToCart(book.id)}
                      className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center mt-4"
                    >
                      <FiShoppingCart className="mr-2" />
                      Add to Cart
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading seller information...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-gray-200 p-4 flex flex-col fixed h-full">
        <div className="flex items-center mb-6 space-x-3 px-4">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full border-2 border-white object-contain" />
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
              <button 
                onClick={() => handleNavigation('/UpdateProfile')} 
                className={`w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center ${
                  location.pathname === '/UpdateProfile' ? 'bg-gray-200 text-green-800' : ''
                }`}
              >
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
              <button 
                onClick={() => handleNavigation('/Orders')} 
                className={`w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center ${
                  location.pathname === '/Orders' ? 'bg-gray-200 text-green-800' : ''
                }`}
              >
                <FiClipboard className="mr-2" />
                Orders
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('/UploadBook')} 
                className={`w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center ${
                  location.pathname === '/UploadBook' ? 'bg-gray-200 text-green-800' : ''
                }`}
              >
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
              <button 
                onClick={() => setShowHelpPopup(true)} 
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center"
              >
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
              <button 
                onClick={handleLogout} 
                className="flex items-center w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* Profile Dropdown */}
        <div className="absolute top-4 right-4 z-40">
          <div className="relative">
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors overflow-hidden border-2 border-white shadow-md"
            >
              {profilePic ? (
                <img 
                  src={profilePic} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-profile.png';
                  }}
                />
              ) : (
                <FiUser className="text-gray-700 text-xl" />
              )}
            </button>
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <button 
                  onClick={() => { handleNavigation('/UpdateProfile'); setShowProfileDropdown(false); }} 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                >
                  <FiUser className="mr-2" />
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

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by book name..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchAndFilter()}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
            <button
              onClick={handleSearchAndFilter}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
            >
              Search
            </button>
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              <FiX className="mr-1" />
              Clear
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <select
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  value={filters.area}
                  onChange={(e) => setFilters({...filters, area: e.target.value})}
                >
                  <option value="">All Areas</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Books Grid */}
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
            HOME
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
              <p className="mt-2 text-gray-600">Loading your books...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-600 text-lg">
                {books.length === 0 
                  ? "You haven't uploaded any books yet." 
                  : "No books match your search criteria."}
              </p>
              {books.length === 0 && (
                <button
                  onClick={() => navigate('/UploadBook')}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Upload Your First Book
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                >
                  {/* Book Cover Image */}
                  <div className="aspect-square overflow-hidden relative">
                    {book.image_path ? (
                      <>
                        <img
                          src={`${process.env.REACT_APP_BACKEND_URL || `${BACKEND_URL}`}/api/books/uploads/${book.image_path}`}
                          alt={book.book_name || book.name}
                          className="w-full h-full object-cover rounded-t-2xl"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.classList.add('hidden');
                            e.target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden w-full h-full bg-gray-100 flex items-center justify-center rounded-t-2xl">
                          <span className="text-gray-400 text-sm">No Cover Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-2xl">
                        <span className="text-gray-400 text-sm">No Cover Image</span>
                      </div>
                    )}
                    {book.video_path && (
                      <button
                        onClick={() => {
                          const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
                          const fullUrl = `${BACKEND_URL}/api/books/uploads/${book.video_path}`;
                          setVideoToPreview(fullUrl);
                        }}
                        className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center hover:bg-blue-200 transition"
                      >
                        <FiPlay className="mr-1" />
                        Preview
                      </button>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="p-4 flex-grow flex flex-col">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2" title={book.name}>
                      {book.name}
                    </h2>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <span className="font-medium mr-1">Category:</span>
                      <span className="truncate">{book.category || 'Not specified'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center flex-1 min-w-0">
                        <FiMapPin className="mr-1 text-gray-500 flex-shrink-0" />
                        <span className="truncate" title={book.area}>{book.area || 'Location not set'}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(book.id);
                        }}
                        className="ml-2 text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
                      >
                        <FiShoppingCart className="text-lg" />
                      </button>
                    </div>
                    
                    <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-green-700 font-bold">R{book.price || '0.00'}</span>
                      <button 
                        className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition"
                        onClick={() => handleViewDetails(book)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Help Popup */}
      {showHelpPopup && <GetHelpPopup onClose={() => setShowHelpPopup(false)} />}
      
      {/* Video Preview Modal */}
      {videoToPreview && (
        <VideoPreviewModal 
          videoPath={videoToPreview}
          onClose={() => setVideoToPreview(null)}
        />
      )}

     {selectedBook && (
  <BookDetailsPopup 
    book={selectedBook} 
    onClose={handleClosePopup}
    ownerDetails={ownerDetails}
    onAddToCart={handleAddToCart}
    loading={loadingOwner}
    setLoading={setLoadingOwner}
  />
)}

{showSuccessToast && (
  <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-md flex items-center space-x-2 animate-toast">
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    <span>Book added to cart!</span>
  </div>
)}

<style>{`
  @keyframes slideUpFade {
    0% { transform: translateY(100%); opacity: 0; }
    50% { transform: translateY(0); opacity: 1; }
    100% { opacity: 0; }
  }
  .animate-toast {
    animation: slideUpFade 2s ease forwards;
  }
`}</style>

    </div>
  );
};

export default SellerBooks;