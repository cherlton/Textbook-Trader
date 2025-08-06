import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle, FiShoppingBag, FiHome, FiClock, FiTruck } from 'react-icons/fi';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`, {
          withCredentials: true
        });
        
        // Ensure the response has the expected structure
        const formattedOrder = {
  ...response.data,
  recipient: {
    first_name: response.data.first_name || 'Unknown',
    last_name: response.data.last_name || '',
    email: response.data.email || '',
    cell_number: response.data.cell_number || '',
    delivery_address: response.data.delivery_address || ''
  },
  items: response.data.items || [],
  total: Number(response.data.total) || 0,
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

  // Helper functions for safe data access
  const getRecipientName = () => {
    if (!order?.recipient) return 'Unknown Recipient';
    return `${order.recipient.first_name || ''} ${order.recipient.last_name || ''}`.trim() || 'Unknown Recipient';
  };

  const getContactInfo = () => {
    if (!order?.recipient) return 'Contact information not available';
    return [order.recipient.email, order.recipient.cell_number]
      .filter(Boolean)
      .join(' | ') || 'No contact info';
  };

  const formatCurrency = (amount) => {
    return `R${(Number(amount) || 0).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Will be confirmed soon';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Order</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
          <p className="mb-4">We couldn't find details for order #{orderId}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <FiCheckCircle className="mx-auto h-12 w-12 text-green-600" />
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your purchase. Your order #{order.id} has been confirmed.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Order Summary
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Order Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  #{order.id}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date Placed</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(order.created_at).toLocaleString()}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status?.replace(/_/g, ' ') || 'Processing'}
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Estimated Delivery</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(order.delivery_date)}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-bold">
                  {formatCurrency(order.total)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Delivery Information
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Recipient</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {getRecipientName()}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Contact</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {getContactInfo()}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Delivery Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {order.recipient?.delivery_address || 'Address not available'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Order Items
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <div className="divide-y divide-gray-200">
              {order.items?.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.book_id} className="py-4 sm:py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6">
                    <div className="flex items-center col-span-3">
                      {item.image_path && (
                        <img
                          src={`/static/uploads/${item.image_path}`}
                          alt={item.book_name}
                          className="h-16 w-16 object-cover rounded border mr-4"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <h4 className="font-medium">{item.book_name || 'Unnamed Item'}</h4>
                        {item.seller_name && (
                          <p className="text-sm text-gray-500">Seller: {item.seller_name}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <p className="text-sm text-gray-900">Qty: {item.quantity || 1}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency((item.price_per_item || 0) * (item.quantity || 1))}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-500">
                  No items found in this order
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <FiHome className="mr-2" />
            Back to Home
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center"
          >
            <FiShoppingBag className="mr-2" />
            View All Orders
          </button>
        </div>

        <div className="mt-12 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-green-600">
                <FiClock className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  Your order is being processed. We'll notify you once its collected by the courier from the seller
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 text-green-600">
                <FiTruck className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  Once collected, your order will be prepared for delivery. Estimated delivery date: {formatDate(order.delivery_date)}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;