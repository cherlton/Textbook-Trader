import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../logo/logo.png';  // adjust path to your logo

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    cell: "",
    profile_picture: null,
  });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "profile_picture") {
      setForm({ ...form, profile_picture: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

const nameRegex = /^[A-Za-z\s]+$/;
  const cellRegex = /^[0-9]+$/;

if (!nameRegex.test(form.name) || !nameRegex.test(form.surname)) {
  setError("Name and surname must contain letters and spaces only.");
  return;
}

  if (!cellRegex.test(form.cell)) {
    setError("Phone number must contain digits only.");
    return;
  }

  if (!validatePassword(form.password)) {
    setError("Password must be at least 8 characters, include uppercase, lowercase, number and special character.");
    return;
  }
   if (form.cell) {

    if (form.cell.length > 10) {
      setError("Phone number must not be more than 10 digits.");
      return;
    }
  }

  const formData = new FormData();
  Object.entries(form).forEach(([key, val]) => {
    if (val) formData.append(key, val);
  });

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setShowSuccess(true);
    } else {
      setError(data.error || data.message || "Registration failed.");
    }
  } catch {
    setError("Network error, try again.");
  }
};

  const closeModal = () => {
    setShowSuccess(false);
    navigate("/login"); // Redirect after closing popup
  };

  const validatePassword = (password) => {
  const uppercase = /[A-Z]/.test(password);
  const lowercase = /[a-z]/.test(password);
  const digit = /\d/.test(password);
  const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return uppercase && lowercase && digit && special && password.length >= 8;
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
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Register
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>
        )}

        <input
          type="text"
          name="name"
          placeholder="First Name"
          className="mb-4 w-full px-3 py-2 rounded border"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="surname"
          placeholder="Surname"
          className="mb-4 w-full px-3 py-2 rounded border"
          value={form.surname}
          onChange={handleChange}
          required
        />
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
        <input
          type="tel"
          name="cell"
          placeholder="Phone Number"
          className="mb-4 w-full px-3 py-2 rounded border"
          value={form.cell}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="profile_picture"
          accept="image/*"
          className="mb-6 w-full"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-bold text-white py-2 rounded font-semibold transition"
        >
          Register
        </button>

        <div className="flex justify-center mt-6 text-sm text-black">
          <a href="/login" className="hover:underline">
            Already have an account? Login
          </a>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4 text-green-700">Registration Successful!</h3>
            <p className="mb-4 text-gray-700">
              Please check your email to confirm your account.
            </p>
            <button
              onClick={closeModal}
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded font-semibold w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
