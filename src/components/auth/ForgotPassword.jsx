import React, { useState } from "react";
import logo from '../../logo/logo.png';  // adjust path to your logo

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    try {
      const res = await fetch(`${ BACKEND_URL}/api/reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Password reset link sent! Please check your email.");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error.");
    }
  };

  return (
    <div className="min-h-screen bg-green-400 flex flex-col items-center justify-center px-4">
      <div className="mb-10">
        <img src={logo} alt="Logo" className="w-32 h-32 rounded border object-contain" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 w-full max-w-md shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-forestgreen text-center">
          Forgot Password
        </h2>
        {status && (
          <p className="text-green-700 text-center mb-4 font-semibold">{status}</p>
        )}
        {error && (
          <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className="mb-6 w-full px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-bold text-white py-2 rounded font-semibold transition"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
