import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../logo/logo.png';
import BACKEND_URL from '../../config';

export default function CourierLogin() {
  const [form, setForm] = useState({ email: "221997441@tut4life.ac.za", password: "Word" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch(`${BACKEND_URL}/api/courier/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Store courier info in sessionStorage
      sessionStorage.setItem("courier_email", form.email);
      sessionStorage.setItem("courier_id", data.courier?.id || "");

      // Navigate to courier dashboard
      navigate("/CourierDashboard");
    } else {
      // Use backend message if provided
      setError(data.message || "Login failed. Please try again.");
    }
  } catch (err) {
    setError("Network error, please try again.");
  }
};

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <div className="mb-10">
        <img 
          src={logo} 
          alt="Logo" 
          className="w-32 h-32 rounded border-2 border-white object-contain" 
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 w-full max-w-md shadow-lg rounded-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Courier Login</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="mb-4 w-full px-3 py-2 rounded border border-gray-300"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="mb-4 w-full px-3 py-2 rounded border border-gray-300"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded font-semibold transition"
        >
          Login as Courier
        </button>

        <div className="mt-4 text-center">
          <a 
            href="/login" 
            className="text-sm text-gray-600 hover:underline"
          >
            Back to regular login
          </a>
        </div>
      </form>
    </div>
  );
}