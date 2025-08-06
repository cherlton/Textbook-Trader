import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  FiShoppingBag, 
  FiHome, 
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser
} from 'react-icons/fi';
import BACKEND_URL from '../../config';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSellerView, setIsSellerView] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/orders/${orderId}`, {
          withCredentials: true
        });
        
        // Check if this is a seller view
        const sellerItems = response.data.items?.filter(item => 
          item.seller_email === response.data.user_email
        );
        setIsSellerView(sellerItems && sellerItems.length > 0);
        
        const formattedOrder = {
          ...response.data,
          total: Number(response.data.total) || 0,
          created_at: response.data.created_at || new Date().toISOString(),
          items: response.data.items?.map(item => ({
            ...item,
            price_per_item: Number(item.price_per_item) || 0,
            quantity: Number(item.quantity) || 1
          })) || [],
          recipient: {
            first_name: response.data.first_name || 'Unknown',
            last_name: response.data.last_name || '',
            email: response.data.email || '',
            cell_number: response.data.cell_number || '',
            delivery_address: response.data.delivery_address || ''
          }
        };
        
        setOrder(formattedOrder);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.put(
        `${BACKEND_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      // Refresh order details
      const response = await axios.get(`${BACKEND_URL}/api/orders/${orderId}`, {
        withCredentials: true
      });
      setOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">Error Loading Order</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2 text-gray-800">Order Not Found</h2>
          <p className="mb-4 text-gray-600">We couldn't find details for order #{orderId}</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-600 hover:text-green-800 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        {/* Header Section */}
        <div className="text-center mb-8">
          <FiCheckCircle className="mx-auto h-12 w-12 text-green-600" />
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            Order #{order.id}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {order.status === 'delivered' ? 'Successfully delivered' : 'Your order is being processed'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FiClock className="mr-2 text-green-600" />
                  Order Status
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Current Status</p>
                    <div className="mt-1">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Placed</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(order.delivery_date)}
                    </p>
                  </div>
                </div>

                {/* Seller Actions */}
                {isSellerView && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Seller Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      {order.status === 'awaiting_approval_by_seller' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate('approved_by_seller')}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                          >
                            Approve Order
                          </button>
                          <button
                            onClick={() => handleStatusUpdate('rejected_by_seller')}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                          >
                            Reject Order
                          </button>
                        </>
                      )}
                      {order.status === 'approved_by_seller' && (
                        <button
                          onClick={() => handleStatusUpdate('accepted_by_courier')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        >
                          Mark as With Courier
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FiPackage className="mr-2 text-green-600" />
                  Order Items ({order.items.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <div key={`${item.book_id}-${item.seller_email}`} className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={item.image_path ? `/static/uploads/${item.image_path}` : '/placeholder-book.jpg'}
                          alt={item.book_name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-book.jpg';
                          }}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-medium text-gray-900">
                            {item.book_name || 'Unnamed Item'}
                          </h4>
                          <p className="ml-4 font-medium text-gray-900">
                            {formatCurrency(item.price_per_item * item.quantity)}
                          </p>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
                          <p>Qty: {item.quantity}</p>
                          <p>{formatCurrency(item.price_per_item)} each</p>
                        </div>
                        {item.seller_name && (
                          <p className="mt-1 text-sm text-gray-500">
                            Sold by: {item.seller_name} {item.seller_surname}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <p className="text-base font-medium text-gray-900">Order Total</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Delivery & Actions */}
          <div className="space-y-6">
            {/* Delivery Information Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FiMapPin className="mr-2 text-green-600" />
                  Delivery Information
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 flex items-center">
                      <FiUser className="mr-2" />
                      Recipient
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {order.recipient.first_name} {order.recipient.last_name}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 flex items-center">
                      <FiMail className="mr-2" />
                      Email
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {order.recipient.email || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 flex items-center">
                      <FiPhone className="mr-2" />
                      Phone
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {order.recipient.cell_number || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 flex items-center">
                      <FiMapPin className="mr-2" />
                      Delivery Address
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {order.recipient.delivery_address || 'Address not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buyer Information (for sellers) */}
            {isSellerView && order.buyer_name && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FiUser className="mr-2 text-green-600" />
                    Customer Information
                  </h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Name</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {order.buyer_name} {order.buyer_surname}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {order.buyer_email || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {order.buyer_cell || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Actions Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Order Actions
                </h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FiShoppingBag className="mr-2" />
                  View All Orders
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <FiHome className="mr-2" />
                  Continue Shopping
                </button>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;