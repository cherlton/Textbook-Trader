import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../logo/logo.png';

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("email", form.email);
        navigate("/home");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error, please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-green-400 flex flex-col items-center justify-center px-4">
      <div className="mb-10">
        <img src={logo} alt="Logo" className="w-32 h-32 rounded border object-contain" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 w-full max-w-md shadow-lg rounded-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="mb-4 w-full px-3 py-2 rounded border"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="mb-4 w-full px-3 py-2 rounded border"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-bold text-black hover:text-white py-2 rounded font-semibold transition"
        >
          Login
        </button>

        <div className="flex justify-between mt-6 text-sm text-bold text-black">
          <a href="/register" className="hover:underline">Create Account</a>
          <a href="/ForgotPassword" className="hover:underline">Forgot Password?</a>
        </div>

        {/* Add Courier Login Link */}
        <div className="mt-4 text-center">
          <a 
            href="/CourierLogin" 
            className="text-sm text-gray-600 hover:underline"
          >
            Login as Courier
          </a>
        </div>
      </form>
    </div>
  );
}