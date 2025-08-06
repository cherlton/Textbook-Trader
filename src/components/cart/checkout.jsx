import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import BACKEND_URL from '../../config';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
 
  const [orderId, setOrderId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Separate state for delivery address with Google Places integration
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [autocompleteAddress, setAutocompleteAddress] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    cell_number: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  // Google Places Autocomplete handlers
  const handleLoadAddress = (autocomplete) => {
    setAutocompleteAddress(autocomplete);
  };

  const handlePlaceChangedAddress = () => {
    if (autocompleteAddress) {
      const place = autocompleteAddress.getPlace();
      setDeliveryAddress(place.formatted_address);
    }
  };

  // Use My Location functionality
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
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
              setDeliveryAddress(results[0].formatted_address);
            } else {
              setError('Could not get address from your location.');
              console.error('Geocoder failed:', status);
            }
          }
        );
      },
      (error) => {
        setError('Unable to retrieve your location.');
        console.error('Geolocation error:', error);
      }
    );
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/cart/view`, { withCredentials: true });
        setCartItems(response.data.cart);
        setTotalPrice(Number(response.data.total_price));
       
      } catch (err) {
        setError('Failed to load cart items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleConfirmPaymentFlow = async () => {
  setError('');
  setPaymentLoading(true);

  const {
    first_name,
    last_name,
    email,
    cell_number,
    cardNumber,
    cardName,
    expiry,
    cvv
  } = formData;

  if (!first_name || !last_name || !email || !cell_number || !deliveryAddress) {
    setError('Please fill in all recipient details before proceeding.');
    setPaymentLoading(false);
    return;
  }

  if (!cardNumber || cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
    setError('Card number must be 16 digits.');
    setPaymentLoading(false);
    return;
  }

  if (!cardName || !/^[A-Za-z\s]+$/.test(cardName)) {
    setError('Cardholder name must contain only letters and spaces.');
    setPaymentLoading(false);
    return;
  }

  if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
    setError('Expiry date must be in MM/YY format.');
    setPaymentLoading(false);
    return;
  }

  if (!cvv || !/^\d{3}$/.test(cvv)) {
    setError('CVV must be exactly 3 digits.');
    setPaymentLoading(false);
    return;
  }

  try {
    const newOrderId = await handleCheckout();
    if (!newOrderId) throw new Error("Order creation failed");

    await handlePayment(newOrderId);
    setShowPaymentForm(false);
  } catch (err) {
    console.error('Payment process failed:', err);
    setError('Something went wrong. Please try again.');
  } finally {
    setPaymentLoading(false);
  }
};

const handleCheckout = async () => {
  try {
    const recipientResponse = await axios.post(`${BACKEND_URL}/api/recipients/add`, {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      cell_number: formData.cell_number,
      delivery_address: deliveryAddress // Use the deliveryAddress state variable
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!recipientResponse.data?.id) {
      throw new Error('Failed to get recipient ID from response');
    }

    const recipientId = Number(recipientResponse.data.id);

    const orderItems = cartItems.map(item => {
      if (!item.book_id || !item.quantity || !item.price_per_item) {
        throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
      }
      return {
        book_id: Number(item.book_id),
        quantity: Number(item.quantity),
        price: Number(item.price_per_item)
      };
    });

    const orderResponse = await axios.post(`${BACKEND_URL}/api/orders/create`, {
      recipient_id: recipientId,
      cart_items: orderItems
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!orderResponse.data?.order_id) {
      throw new Error('Failed to get order ID from response');
    }

    const newOrderId = Number(orderResponse.data.order_id);
    setOrderId(newOrderId); // still keep it in state for display if needed
    setShowPaymentForm(true);
    setError('');
    return newOrderId;

  } catch (err) {
    console.error('Checkout Error:', err);
    const errorMessage = err.response?.data?.error || err.message || 'Checkout failed. Please try again.';
    setError(errorMessage);

    if (err.response?.status === 401) {
      navigate('/login');
    }

    return null;
  }
};

const handlePayment = async (orderIdToUse) => {
  if (!formData.cardNumber || !formData.cardName || !formData.expiry || !formData.cvv) {
    setError('Please fill in all payment details');
    return;
  }

  setPaymentLoading(true);
  setError('');

  try {
    await new Promise(resolve => setTimeout(resolve, 1500)); // mock payment delay
    await axios.delete(`${BACKEND_URL} /api/cart/clear`, { withCredentials: true });

    navigate(`/order-confirmation/${orderIdToUse}`);
  } catch (err) {
    setError(err.response?.data?.error || 'Payment failed');
    console.error(err);
  } finally {
    setPaymentLoading(false);
  }
};

  if (loading) return <div className="text-center py-12">Loading checkout...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-gray-600 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      
      {/* Recipient Information Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Recipient Information</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name*</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name*</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cell Number*</label>
            <input
              type="tel"
              name="cell_number"
              value={formData.cell_number}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Delivery Address*</label>
            <LoadScript
              googleMapsApiKey="AIzaSyC1CE9DjOz0lpPuBRSttcbb4UVoter4oVs"
              libraries={['places']}
            >
              <Autocomplete onLoad={handleLoadAddress} onPlaceChanged={handlePlaceChangedAddress}>
                <input
                  type="text"
                  placeholder="Enter delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full border p-2 rounded"
                  required
                />
              </Autocomplete>
            </LoadScript>
            
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Use My Location
            </button>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3">
          {cartItems.map(item => (
            <div key={item.book_id} className="flex justify-between border-b pb-2">
              <div className="flex items-center">
                <img 
                  src={`/static/uploads/${item.image_path}`} 
                  alt={item.title} 
                  className="w-16 h-16 object-cover rounded mr-4 border"
                />
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <p>R{(item.price_per_item * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg pt-2">
            <p>Total:</p>
            <p>R{totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Payment Form Modal */}
     {showPaymentForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={() => setShowPaymentForm(false)}
      >
        ×
      </button>
      <h3 className="text-lg font-bold mb-4">Enter Payment Details</h3>
{error && (
  <p className="text-red-500 text-sm mt-2">{error}</p>
)}

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Card Number"
          value={formData.cardNumber}
          onChange={(e) =>
            setFormData({ ...formData, cardNumber: e.target.value })
          }
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Cardholder Name"
          value={formData.cardName}
          onChange={(e) =>
            setFormData({ ...formData, cardName: e.target.value })
          }
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Expiry (MM/YY)"
          value={formData.expiry}
          onChange={(e) =>
            setFormData({ ...formData, expiry: e.target.value })
          }
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="CVV"
          value={formData.cvv}
          onChange={(e) =>
            setFormData({ ...formData, cvv: e.target.value })
          }
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mt-6">
        <button
          onClick={handleConfirmPaymentFlow}
          disabled={paymentLoading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {paymentLoading ? "Processing..." : "Confirm Payment"}
        </button>
      </div>
    </div>
  </div>
)}

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={() => setShowPaymentForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Proceed to Payment
        </button>

      </div>

      {orderId && !showPaymentForm && (
        <div className="bg-green-100 text-green-800 p-4 rounded mt-6 text-center">
          Order created successfully! Your order ID is <strong>{orderId}</strong>.
        </div>
      )}
    </div>
  );
};

export default Checkout;