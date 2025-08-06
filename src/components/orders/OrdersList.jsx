import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiShoppingBag, 
  
  FiClock,
  FiUser
} from 'react-icons/fi';
import BACKEND_URL from '../../config';


const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('user'); // 'user' or 'seller'

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const endpoint = view === 'user' ? `${BACKEND_URL}/api/orders/user` : `${BACKEND_URL}/api/orders/seller`;
        const response = await axios.get(endpoint, {
          withCredentials: true
        });
        
        const formattedOrders = response.data.map(order => ({
          ...order,
          total: Number(order.total) || 0,
          created_at: order.created_at || new Date().toISOString(),
          recipient: {
            first_name: order.first_name || 'Unknown',
            last_name: order.last_name || '',
            email: order.email || '',
            cell_number: order.cell_number || '',
            delivery_address: order.delivery_address || ''
          }
        }));
        
        setOrders(formattedOrders);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [view]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return `R${(Number(amount) || 0).toFixed(2)}`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'awaiting_approval_by_seller': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Approval' },
      'approved_by_seller': { color: 'bg-blue-100 text-blue-800', text: 'Approved' },
      'rejected_by_seller': { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      'accepted_by_courier': { color: 'bg-purple-100 text-purple-800', text: 'With Courier' },
      'enroute': { color: 'bg-indigo-100 text-indigo-800', text: 'On The Way' },
      'delivered': { color: 'bg-green-100 text-green-800', text: 'Delivered' }
    };
    
    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: status?.replace(/_/g, ' ') || 'Unknown' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">Error Loading Orders</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <FiShoppingBag className="mx-auto h-12 w-12 text-green-600" />
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            {view === 'user' ? 'Your Orders' : 'Your Sales'}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {view === 'user' ? 'View all your purchases' : 'View all customer orders'}
          </p>
          
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={() => setView('user')}
              className={`px-4 py-2 rounded-md ${view === 'user' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <FiUser className="inline mr-2" />
              My Purchases
            </button>
            <button
              onClick={() => setView('seller')}
              className={`px-4 py-2 rounded-md ${view === 'seller' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <FiShoppingBag className="inline mr-2" />
              My Sales
            </button>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No {view === 'user' ? 'orders' : 'sales'} found
            </h3>
            <p className="mt-2 text-gray-500">
              {view === 'user' 
                ? "You haven't placed any orders yet." 
                : "You don't have any sales yet."}
            </p>
            <button
              onClick={() => navigate(view === 'user' ? '/home' : '/UploadBook')}
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {view === 'user' ? 'Start Shopping' : 'Manage Books'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900 mr-3">
                          Order #{order.id}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        <FiClock className="inline mr-1" />
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:items-end">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(order.total)}
                      </p>
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  
                  {view === 'seller' && order.buyer_name && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        <FiUser className="inline mr-1" />
                        Customer: {order.buyer_name} {order.buyer_surname}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;