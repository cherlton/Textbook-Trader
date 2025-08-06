import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiLogOut, FiSearch, FiFilter, FiX, FiMapPin, FiTrash2, FiPlay } from 'react-icons/fi';
import logo from '../../logo/logo.png';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FiShoppingCart, FiHelpCircle,FiDownload, FiUser, FiHome,
  FiMail, FiPhone, FiUpload, FiClipboard
} from "react-icons/fi";
import { FiEdit2 } from 'react-icons/fi';
import {  FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
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
      const response = await fetch('/api/support/request', {
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
        setEmail('');
        setQuery('');
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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

const BookUpdateModal = ({ book, onClose, onUpdate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: book.name,
    category: book.category,
    price: book.price
  });
  
  // Separate state for area with Google Places integration
  const [area, setArea] = useState(book.area);
  const [autocompleteArea, setAutocompleteArea] = useState(null);
  
  const [newImage, setNewImage] = useState(null);
  const [newVideo, setNewVideo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Google Places Autocomplete handlers
  const handleLoadArea = (autocomplete) => {
    setAutocompleteArea(autocomplete);
  };

  const handlePlaceChangedArea = () => {
    if (autocompleteArea) {
      const place = autocompleteArea.getPlace();
      setArea(place.formatted_address);
    }
  };

  // Use My Location functionality
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            if (status === 'OK' && results[0]) {
              setArea(results[0].formatted_address);
            } else {
              setErrorMessage('Could not get address from your location.');
              console.error('Geocoder failed:', status);
            }
          }
        );
      },
      (error) => {
        setErrorMessage('Unable to retrieve your location.');
        console.error('Geolocation error:', error);
      }
    );
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.match(/\.(mp4|mov|avi)$/i)) {
        setErrorMessage('Please select a valid video file (MP4, MOV, AVI)');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setErrorMessage('Video file must be less than 100MB');
        return;
      }
      setNewVideo(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('area', area); // Use the area state variable
      formDataToSend.append('price', formData.price);
      if (newImage) formDataToSend.append('image', newImage);
      if (newVideo) formDataToSend.append('video', newVideo);

      const response = await axios.put(`/api/books/${book.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if (response.status === 200) {
        onUpdate();
        handleClose();
      }
    } catch (err) {
      console.error('Update error:', err);
      if (err.response && err.response.status === 400) {
        setErrorMessage(err.response.data.error || err.response.data.reason || 'Cannot update book due to active orders');
      } else {
        setErrorMessage('Failed to update book. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white p-6 rounded-lg max-w-md w-full transform transition-all duration-300 ${isVisible ? 'scale-100' : 'scale-95'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Update Book</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start">
            <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Book Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-700 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select a category</option>
              <option value="programming">Programming</option>
              <option value="novel_romance">Novel - Romance</option>
              <option value="novel_action">Novel - Action</option>
              <option value="novel_comedy">Novel - Comedy</option>
              <option value="novel_horror">Novel - Horror</option>
              <option value="novel_adventure">Novel - Adventure</option>
              <option value="networking">Networking</option>
              <option value="database">Database</option>
              <option value="software_dev">Software Development</option>
              <option value="hosting">Hosting</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Location/Area</label>
            <LoadScript
              googleMapsApiKey="AIzaSyC1CE9DjOz0lpPuBRSttcbb4UVoter4oVs"
              libraries={['places']}
            >
              <Autocomplete onLoad={handleLoadArea} onPlaceChanged={handlePlaceChangedArea}>
                <input
                  type="text"
                  placeholder="Location/Area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-green-700 focus:border-transparent"
                  required
                />
              </Autocomplete>
            </LoadScript>
            
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="mt-2 bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition"
            >
              Use My Location
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-700 focus:border-transparent"
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">New Cover Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {previewImage && (
              <div className="mt-2">
                <img src={previewImage} alt="Preview" className="h-20 object-contain rounded" />
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">New Video (optional)</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {book.video_path && !newVideo && (
              <p className="text-xs text-gray-500 mt-1">Current video will be kept if no new video is selected</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : 'Update Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ book, onClose, onConfirm }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const handleDelete = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await onConfirm(book.id);
      handleClose();
    } catch (err) {
      console.error('Delete error:', err);
      if (err.response && err.response.status === 400) {
        setErrorMessage(err.response.data.error || err.response.data.reason || 'Cannot delete book due to active orders');
      } else {
        setErrorMessage('Failed to delete book. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white p-6 rounded-lg max-w-md w-full transform transition-all duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Confirm Deletion</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start">
            <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        
        <p className="mb-6">Are you sure you want to delete <span className="font-semibold">"{book.name}"</span>? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : 'Delete'}
          </button>
        </div>
      </div>
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
  const [bookToUpdate, setBookToUpdate] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    area: '',
  });
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [videoToPreview, setVideoToPreview] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/api/auth/me', {
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
        const res = await fetch('/api/auth/profile-picture', {
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
        const res = await axios.get('/api/books/', {
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
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePicture();
    fetchUserInfo();
    fetchBooks();
  }, []);

  const handleUpdateBook = async () => {
    try {
      const res = await axios.get('/api/books/', {
        withCredentials: true
      });
      setBooks(res.data);
      setFilteredBooks(res.data);
    } catch (err) {
      console.error('Error refreshing books after update:', err);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`/api/books/${bookId}`, {
        withCredentials: true
      });
      setBooks(books.filter(book => book.id !== bookId));
      setFilteredBooks(filteredBooks.filter(book => book.id !== bookId));
    } catch (err) {
      console.error('Error deleting book:', err);
      throw err; // Re-throw to be caught in the modal
    }
  };

  const handleSearchAndFilter = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('name', searchTerm);
      if (filters.category) params.append('category', filters.category);
      if (filters.area) params.append('area', filters.area);
      
      const res = await axios.get(`/api/books/filter?${params.toString()}`, {
        withCredentials: true
      });
      
      setFilteredBooks(res.data);
    } catch (err) {
      console.error('Error filtering books:', err);
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
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      navigate('/LandingPage');
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
            Your Uploaded Books
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
                          src={`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/books/uploads/${book.image_path}`}
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
                          const fullUrl = `${backendUrl}/api/books/uploads/${book.video_path}`;
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
                      <div className="flex items-center">
                        <FiMapPin className="mr-1 text-gray-500 flex-shrink-0" />
                        <span className="truncate" title={book.area}>{book.area || 'Location not set'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex">
                        <button 
                          onClick={() => setBookToUpdate(book)}
                          className="text-blue-500 hover:text-blue-700 ml-2"
                          title="Edit book"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          onClick={() => setBookToDelete(book)}
                          className="text-red-500 hover:text-red-700 ml-2"
                          title="Delete book"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-green-700 font-bold">R{book.price || '0.00'}</span>
                      <button  
                        className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition"
                        onClick={() => navigate(`/Orders?view=sales`)}
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
      
      {/* Delete Confirmation Modal */}
      {bookToDelete && (
        <DeleteConfirmationModal 
          book={bookToDelete}
          onClose={() => setBookToDelete(null)}
          onConfirm={handleDeleteBook}
        />
      )}

      {/* Update Book Modal */}
      {bookToUpdate && (
        <BookUpdateModal 
          book={bookToUpdate}
          onClose={() => setBookToUpdate(null)}
          onUpdate={handleUpdateBook}
        />
      )}
      
      {/* Video Preview Modal */}
      {videoToPreview && (
        <VideoPreviewModal 
          videoPath={videoToPreview}
          onClose={() => setVideoToPreview(null)}
        />
      )}
    </div>
  );
};

export default SellerBooks;