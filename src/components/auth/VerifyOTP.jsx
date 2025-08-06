import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BACKEND_URL from '../../config';

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [cell, setCell] = useState("");

  useEffect(() => {
    const stateEmail = location.state?.email || localStorage.getItem("email");
    const stateCell = location.state?.cell || localStorage.getItem("cell");

    if (!stateEmail || !stateCell) {
      navigate("/login");
    } else {
      setEmail(stateEmail);
      setCell(stateCell);
    }
  }, [location.state, navigate]);

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp.trim().length < 4) {
      return setError("Please enter a valid OTP");
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/whatsapp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cell, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setMessage("OTP verified successfully!");
        localStorage.clear(); // Clear login session data
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error while verifying OTP");
    }
  };

  return (
    <div className="min-h-screen bg-green-400 flex flex-col items-center justify-center px-4">
      <form
        onSubmit={handleOTPSubmit}
        className="bg-white p-8 w-full max-w-md shadow-lg rounded-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Verify OTP</h2>

        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {!user ? (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="mb-4 w-full px-3 py-2 rounded border"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded font-semibold transition"
            >
              Verify OTP
            </button>
          </>
        ) : (
          <div className="bg-gray-100 p-4 mt-4 rounded text-black">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.cell}</p>
            <p className="mt-2 text-green-700 font-semibold">You are now logged in.</p>
          </div>
        )}
      </form>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [cell, setCell] = useState("");

  useEffect(() => {
    const stateEmail = location.state?.email || localStorage.getItem("email");
    const stateCell = location.state?.cell || localStorage.getItem("cell");

    if (!stateEmail || !stateCell) {
      navigate("/login");
    } else {
      setEmail(stateEmail);
      setCell(stateCell);
    }
  }, [location.state, navigate]);

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp.trim().length < 4) {
      return setError("Please enter a valid OTP");
    }

    try {
      const res = await fetch("/api/auth/whatsapp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cell, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setMessage("OTP verified successfully!");
        localStorage.clear(); // Clear login session data
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error while verifying OTP");
    }
  };

  return (
    <div className="min-h-screen bg-green-400 flex flex-col items-center justify-center px-4">
      <form
        onSubmit={handleOTPSubmit}
        className="bg-white p-8 w-full max-w-md shadow-lg rounded-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Verify OTP</h2>

        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {!user ? (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="mb-4 w-full px-3 py-2 rounded border"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded font-semibold transition"
            >
              Verify OTP
            </button>
          </>
        ) : (
          <div className="bg-gray-100 p-4 mt-4 rounded text-black">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.cell}</p>
            <p className="mt-2 text-green-700 font-semibold">You are now logged in.</p>
          </div>
        )}
      </form>
    </div>
  );
}
