import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../../logo/logo.png';
import { FiLogOut } from 'react-icons/fi';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FiShoppingCart, FiHelpCircle, FiUser, FiHome,
  FiMail, FiPhone, FiUpload,FiDownload, FiClipboard
} from "react-icons/fi";
import {  FiCheckCircle } from 'react-icons/fi';
import {
  LoadScript,
  Autocomplete
} from '@react-google-maps/api';
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

const UploadBook = () => {
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // CHANGE 1: Rename 'start' to 'area' to match your backend
  const [area, setArea] = useState('');
  const [autocompleteArea, setAutocompleteArea] = useState(null);

  const handleLoadArea = (autocomplete) => {
    setAutocompleteArea(autocomplete);
  };

  const handlePlaceChangedArea = () => {
    if (autocompleteArea) {
      const place = autocompleteArea.getPlace();
      setArea(place.formatted_address);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
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
              setArea(results[0].formatted_address); // CHANGE 2: Use setArea instead of setStart
            } else {
              alert('Could not get address from your location.');
              console.error('Geocoder failed:', status);
            }
          }
        );
      },
      (error) => {
        alert('Unable to retrieve your location.');
        console.error('Geolocation error:', error);
      }
    );
  };

  // CHANGE 3: Update formData to include 'area' instead of 'start'
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    area: '', // Changed from 'start' to 'area'
    price: '',
    image: null,
    video: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

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

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else if (name === 'video') {
      setFormData({ ...formData, video: files[0] });
      setVideoPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('category', formData.category);
    // CHANGE 4: Send the area value from the separate state
    formDataToSend.append('area', area); // Use the area state variable
    formDataToSend.append('price', formData.price);
    formDataToSend.append('image', formData.image);
    if (formData.video) {
      formDataToSend.append('video', formData.video);
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/books/add`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      
      if (response.status === 201) {
        alert('Book uploaded successfully!');
        navigate('/SellerBooks');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
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

      {showHelpPopup && <GetHelpPopup onClose={() => setShowHelpPopup(false)} />}
    
      {/* Main Content */}
      <div className="flex-1 ml-64 flex justify-center items-center p-8">
        <div className="w-full max-w-xl bg-white shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Upload Your Book</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Book Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            
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

            {/* CHANGE 5: Update the Google Places Autocomplete section */}
            <LoadScript
              googleMapsApiKey="AIzaSyC1CE9DjOz0lpPuBRSttcbb4UVoter4oVs"
              libraries={['places']}
            >
              <Autocomplete onLoad={handleLoadArea} onPlaceChanged={handlePlaceChangedArea}>
                <input
                  type="text"
                  placeholder="Location/Area"
                  value={area} // CHANGE 6: Use area instead of start
                  onChange={(e) => setArea(e.target.value)} // CHANGE 7: Use setArea
                  className="border p-2 rounded w-full"
                  required
                />
              </Autocomplete>
            </LoadScript>
            
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Use My Location
            </button>
    
            <input
              type="number"
              name="price"
              placeholder="Price (Rands)"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full border p-2 rounded"
            />

            <div>
              <label className="block font-medium mb-1">Upload Image (required):</label>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Book Preview"
                  className="mt-2 w-32 h-40 object-cover border"
                />
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Upload Video (optional):</label>
              <input
                type="file"
                accept="video/*"
                name="video"
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {videoPreview && (
                <video
                  controls
                  src={videoPreview}
                  className="mt-2 w-full max-h-64"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-green-600 text-white py-2 hover:bg-green-700 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Uploading...' : 'Submit Book'}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-gray-300 text-black py-2 mt-2 hover:bg-gray-400 rounded"
            >
              Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadBook;