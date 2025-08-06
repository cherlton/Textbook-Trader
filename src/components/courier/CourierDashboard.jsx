import React, { useState, useEffect } from 'react';
import { FiLogOut, FiUser, FiHome, FiTruck, FiPackage, FiClock, FiCheckCircle, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BACKEND_URL from '../../config';

const CourierDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  // Fetch courier profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/courier/auth/profile`, { withCredentials: true });
    setProfile(response.data.courier); // ✅ unpack the courier!
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Fetch orders based on filter
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/courier/orders`, { withCredentials: true });
        // Filter on frontend since backend doesn't support status filter
        const filteredOrders = filter === 'all' 
          ? response.data 
          : response.data.filter(order => order.status === filter);
        
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'orders' || activeTab === 'dashboard') {
      fetchOrders();
    }
  }, [activeTab, filter]);

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/courier/auth/logout`, {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/courier/order/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      // Refresh orders after update
      const response = await axios.get(`${BACKEND_URL}/api/courier/orders`, { withCredentials: true });
      setOrders(response.data);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const OrderCard = ({ order }) => {
    // Combine recipient names from backend structure
    const recipientName = `${order.recipient_first_name} ${order.recipient_last_name}`;
      const recipientContact = `${order.recipient_cell}`;
    const recipientAddress = `${order.delivery_address}`;

    // Create books string from items if available
    const booksString = order.items 
      ? order.items.map(item => item.book_name).join(', ') 
      : 'Loading items...';

    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
            <p className="text-sm text-gray-600">{booksString}</p>
            <p className="text-sm text-gray-600 mt-1">
              <FiMapPin className="inline mr-1" />
              {recipientAddress}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'collected' ? 'bg-blue-100 text-blue-800' :
            order.status === 'in_transit' ? 'bg-purple-100 text-purple-800' :
            'bg-green-100 text-green-800'
          }`}>
            {order.status.replace('_', ' ')}
          </span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Recipient:</span> {recipientName}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Contact:</span> {recipientContact}
            </p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedOrder(order)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Details
            </button>
            {order.status === 'pending' && (
              <button 
                onClick={() => updateOrderStatus(order.id, 'collected')}
                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                Collect
              </button>
            )}
            {order.status === 'collected' && (
              <button 
                onClick={() => updateOrderStatus(order.id, 'in_transit')}
                className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
              >
                Start Delivery
              </button>
            )}
            {order.status === 'in_transit' && (
              <button 
                onClick={() => updateOrderStatus(order.id, 'delivered')}
                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                Mark Delivered
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    const [details, setDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(true);

    useEffect(() => {
      const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/courier/order/${order.id}`, { withCredentials: true });
          setDetails(response.data);
        } catch (error) {
          console.error('Error fetching order details:', error);
        } finally {
          setLoadingDetails(false);
        }
      };

      fetchOrderDetails();
    }, [order.id]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Order Details #{order.id}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>

            {loadingDetails ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : details ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">Recipient Information</h3>
                    <p className="text-gray-600">{details.recipient_name} {details.recipient_surname}</p>
                    <p className="text-gray-600">{details.recipient_email}</p>
                    <p className="text-gray-600">{details.cell_number}</p>
                    <p className="text-gray-600 mt-2">
                      <FiMapPin className="inline mr-1" />
                      {details.delivery_address}
                    </p>

                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">Order Information</h3>
                    <p className="text-gray-600">
                      <span className="font-medium">Status:</span> {details.status}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Created:</span> {formatDate(details.created_at)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Delivery Date:</span> {formatDate(details.delivery_date)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Buyer:</span> {details.buyer_name} {details.buyer_surname}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Total:</span> R{details.total}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Items</h3>
                  <div className="space-y-3">
                    {details.items && details.items.map((item, index) => (
                      <div key={index} className="flex items-start p-3 border-b border-gray-100">
                        {item.image_path && (
                          <img
                            src={`${process.env.REACT_APP_BACKEND_URL || `${BACKEND_URL}`}/api/books/uploads/${item.image_path}`}
                            alt={item.book_name}
                            className="w-16 h-16 object-cover rounded mr-3"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.book_name}</h4>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-600">R{item.price_per_item} each</p>
                          <p className="text-sm text-gray-600">Seller: {item.seller_email}</p>
                          <p className="text-sm text-green-800">Collection Address: <span className=' font-extrabold text-green-800 text-md'>{item.seller_address}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-end space-x-3">
                    {details.status === 'pending' && (
                      <button
                        onClick={() => {
                          updateOrderStatus(details.id, 'collected');
                          onClose();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Collect Order
                      </button>
                    )}
                    {details.status === 'collected' && (
                      <button
                        onClick={() => {
                          updateOrderStatus(details.id, 'in_transit');
                          onClose();
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      >
                        Start Delivery
                      </button>
                    )}
                    {details.status === 'in_transit' && (
                      <button
                        onClick={() => {
                          updateOrderStatus(details.id, 'delivered');
                          onClose();
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Failed to load order details
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ProfileSection = () => {
    const [formData, setFormData] = useState({
      name: profile?.name || '',
      surname: profile?.surname || '',
      cell: profile?.cell || '',
      vehicle_type: profile?.vehicle_type || '',
      license_plate: profile?.license_plate || '',
      is_active: profile?.is_active || true
    });
    const [profilePic, setProfilePic] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    };

    const handleFileChange = (e) => {
      setProfilePic(e.target.files[0]);
    };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccessMessage('');
  setErrorMessage('');

  // ✅ Add validation
  const nameRegex = /^[A-Za-z\s]+$/;
  const digitsRegex = /^[0-9]+$/;

  if (!nameRegex.test(formData.name) || !nameRegex.test(formData.surname)) {
    setErrorMessage('Name and surname must contain letters and spaces only.');
    return;
  }

  if (!digitsRegex.test(formData.cell)) {
    setErrorMessage('Phone number must contain digits only.');
    return;
  }

  if (formData.cell.length > 10) {
    setErrorMessage('Phone number must not be more than 10 digits.');
    return;
  }

  try {
    const form = new FormData();
    form.append('name', formData.name);
    form.append('surname', formData.surname);
    form.append('cell', formData.cell);
    form.append('vehicle_type', formData.vehicle_type);
    form.append('license_plate', formData.license_plate);
    form.append('is_active', formData.is_active);
    if (profilePic) {
      form.append('profile_picture', profilePic);
    }

    const response = await axios.put(`${BACKEND_URL}/api/courier/auth/profile`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });

    setProfile(response.data);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  } catch (error) {
    setErrorMessage('Failed to update profile. Please try again.');
    console.error('Error updating profile:', error);
  }
};


    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">My Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              {profile?.profile_picture ? (
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL || `${BACKEND_URL}`}/api/courier/auth/uploads/${profile.profile_picture}`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-600"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-600">
                  <FiUser className="text-blue-600 text-2xl" />
                </div>
              )}
              <input
                type="file"
                id="profile_picture"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <label
                htmlFor="profile_picture"
                className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </label>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{profile?.name} {profile?.surname}</h3>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="cell"
              value={formData.cell}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              >
                <option value="">Select Vehicle</option>
                <option value="Bike">Bike</option>
                <option value="Car">Car</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <input
                type="text"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Available for deliveries
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    );
  };

  const DashboardStats = () => {
    const [stats, setStats] = useState({
      pending: 0,
      collected: 0,
      in_transit: 0,
      delivered: 0,
      total: 0
    });

    useEffect(() => {
      const fetchStats = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/courier/orders`, { withCredentials: true });
          const allOrders = response.data;
          
          setStats({
            pending: allOrders.filter(o => o.status === 'pending').length,
            collected: allOrders.filter(o => o.status === 'collected').length,
            in_transit: allOrders.filter(o => o.status === 'in_transit').length,
            delivered: allOrders.filter(o => o.status === 'delivered').length,
            total: allOrders.length
          });
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      };

      fetchStats();
    }, []);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.pending}</h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiClock className="text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Collected</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.collected}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiPackage className="text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Transit</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.in_transit}</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiTruck className="text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.delivered}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiCheckCircle className="text-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-4 flex flex-col fixed h-full">
        <div className="flex items-center mb-8 mt-2 px-2">
          <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mr-3">
            <FiTruck className="text-xl" />
          </div>
          <div>
            <div className="font-semibold">Courier Dashboard</div>
            {profile && (
              <div className="text-xs opacity-80">{profile.name} {profile.surname}</div>
            )}
          </div>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-3 rounded flex items-center transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-700 text-white' : 'hover:bg-blue-800'
            }`}
          >
            <FiHome className="mr-3" />
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded flex items-center transition-colors ${
              activeTab === 'orders' ? 'bg-blue-700 text-white' : 'hover:bg-blue-800'
            }`}
          >
            <FiPackage className="mr-3" />
            My Deliveries
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded flex items-center transition-colors ${
              activeTab === 'profile' ? 'bg-blue-700 text-white' : 'hover:bg-blue-800'
            }`}
          >
            <FiUser className="mr-3" />
            My Profile
          </button>
        </nav>

        <div className="mt-auto mb-4">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded flex items-center hover:bg-blue-800 transition-colors"
          >
            <FiLogOut className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
            <DashboardStats />
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Deliveries</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : orders.slice(0, 5).length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent deliveries found
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">My Deliveries</h1>
              <div className="flex space-x-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="collected">Collected</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading deliveries...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <FiPackage className="inline-block text-4xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">No deliveries found</h3>
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? "You don't have any deliveries assigned yet." 
                    : `No deliveries with status "${filter.replace('_', ' ')}" found.`}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && profile && (
          <ProfileSection />
        )}

        {selectedOrder && (
          <OrderDetailsModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default CourierDashboard;











