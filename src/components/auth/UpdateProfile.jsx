import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../logo/logo.png";
import {useLocation } from "react-router-dom";
import {
  FiLogOut, FiShoppingCart, FiHelpCircle, FiDownload,FiUser, FiHome,
  FiMail, FiPhone, FiUpload, FiClipboard
} from "react-icons/fi";
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


export default function UpdateProfile() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [fullName, setFullName] = useState('');
    const location = useLocation(); // Add this import from react-router-dom

  const [form, setForm] = useState({
    name: '',
    surname: '',
    cell: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentProfilePic, setCurrentProfilePic] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/me', {
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



    // Fetch user profile data
    fetch('/api/auth/profile', {
      credentials: 'include'
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setForm({
            name: data.name || '',
            surname: data.surname || '',
            cell: data.cell || '',
          });
          if (data.profile_picture) {
            setCurrentProfilePic(`/api/auth/uploads/${data.profile_picture}`);
          }
        }
      })
      .catch(() => setError("Error loading profile."));
          fetchUserInfo();

  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

const handlePasswordChange = (e) => {
  const { name, value } = e.target;
  setPasswordForm(prev => ({ ...prev, [name]: value }));
};

const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  setPasswordError('');
  setPasswordSuccess('');

  // Check if new passwords match
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    setPasswordError("New passwords don't match");
    return;
  }

  // Validate new password strength
  if (!validatePassword(passwordForm.newPassword)) {
    setPasswordError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
    return;
  }

  try {
    const response = await fetch('/api/auth/update-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      })
    });

    const data = await response.json();
    if (response.ok) {
      setPasswordSuccess("Password updated successfully!");
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setShowPasswordModal(false), 2000);
    } else {
      setPasswordError(data.error || "Password update failed");
    }
  } catch (err) {
    setPasswordError("Network error. Please try again.");
  }
};

function validatePassword(password) {
  // Minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}

const handleDeleteAccount = async () => {
  try {
    const response = await fetch('/api/auth/profile', {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok) {
      navigate('/register');
    } else {
      const data = await response.json();
      setError(data.error || "Account deletion failed");
    }
  } catch (err) {
    setError("Network error. Please try again.");
  }
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  // ✅ Add validation regexes
  const nameRegex = /^[A-Za-z\s]+$/;
  const digitsRegex = /^[0-9]+$/;

  if (form.name && !nameRegex.test(form.name)) {
    setError("Name must contain letters and spaces only.");
    return;
  }

  if (form.surname && !nameRegex.test(form.surname)) {
    setError("Surname must contain letters and spaces only.");
    return;
  }

  if (form.cell) {
    if (!digitsRegex.test(form.cell)) {
      setError("Phone number must contain digits only.");
      return;
    }
    if (form.cell.length > 10) {
      setError("Phone number must not be more than 10 digits.");
      return;
    }
  }

  const formData = new FormData();
  if (form.name) formData.append("name", form.name);
  if (form.surname) formData.append("surname", form.surname);
  if (form.cell) formData.append("cell", form.cell);
  if (profilePicture) formData.append("profile_picture", profilePicture);

  try {
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      body: formData,
      credentials: 'include'
    });

    const data = await response.json();
    if (response.ok) {
      setSuccess("Profile updated successfully!");
      if (profilePicture) {
        setCurrentProfilePic(URL.createObjectURL(profilePicture));
      }
      setProfilePicture(null);
      setPreviewUrl(null);
    } else {
      setError(data.error || "Update failed. Please try again.");
    }
  } catch (err) {
    setError("Network error. Please try again.");
  }
};



  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: 'include'
      });
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  

  const handleNavigation = (path) => {
    navigate(path);
  };
return (
  <div className="min-h-screen bg-white flex">
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
              onClick={() => handleNavigation('/home')} 
              className={`w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center ${
                location.pathname === '/home' ? 'bg-gray-200 text-green-800' : ''
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
            <button onClick={() => handleNavigation('/cart')} className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center">
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
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 hover:text-green-800 transition flex items-center">
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

    {/* All Modals - positioned outside main content flow */}
    {showHelpPopup && <GetHelpPopup onClose={() => setShowHelpPopup(false)} />}
    
    {showPasswordModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Change Password</h2>
            <button onClick={() => setShowPasswordModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
            {passwordSuccess && <div className="text-green-500 text-sm">{passwordSuccess}</div>}
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-green-700 text-white py-2 px-4 rounded"
              >
                Update Password
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {showDeleteConfirm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Confirm Account Deletion</h2>
          <p className="mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
          <div className="flex space-x-4">
            <button
              onClick={handleDeleteAccount}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded"
            >
              Delete Account
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Main Content */}
    <div className="flex-1 ml-64 flex flex-col items-center justify-center p-8">
      <div className="mb-10">
        {currentProfilePic ? (
          <img 
            src={currentProfilePic} 
            alt="Profile" 
            className="w-32 h-32 rounded-full border-4 border-green-700 object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-green-700 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-xl">No Image</span>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 w-full max-w-md shadow-lg rounded-lg"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-800">Update Profile</h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p>{success}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            First Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="First Name"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
            Last Name
          </label>
          <input
            type="text"
            id="surname"
            name="surname"
            placeholder="Last Name"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.surname}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cell">
            WhatsApp Number
          </label>
          <input
            type="text"
            id="cell"
            name="cell"
            placeholder="e.g. whatsapp:+27821234567"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.cell}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profile_picture">
            Profile Picture
          </label>
          <input
            type="file"
            id="profile_picture"
            name="profile_picture"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">New Profile Picture Preview:</p>
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-4 mb-4">
          <button
            type="submit"
            className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded font-semibold transition"
          >
            Update Profile
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded font-semibold transition"
            onClick={() => navigate("/home")}
          >
            Cancel
          </button>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Change Password
          </button>
          
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Delete Account
          </button>
        </div>
      </form>
    </div>
  </div>
);
}