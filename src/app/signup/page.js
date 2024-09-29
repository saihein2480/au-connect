// src/app/signup/page.js

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
    faculty: "",
    gender: "",
    studentId: "",
    role: "user", // Default role is 'user'
    verifyCode: "", // For admin verification
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        window.alert("Signup successful! Please log in.");
        router.push("/login");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <form onSubmit={handleSignup} className="max-w-sm mx-auto bg-white p-6 rounded shadow-md mt-10">
        <h2 className="text-center text-2xl font-bold mb-4">Sign Up</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Email is required for both user and admin */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {formData.role === "admin" && (
          <div className="mb-4">
            <label htmlFor="verifyCode" className="block text-sm font-medium text-gray-700">
              Admin Verify Code
            </label>
            <input
              type="text"
              id="verifyCode"
              name="verifyCode"
              value={formData.verifyCode}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
        )}

        {/* Add the other fields for displayName, faculty, gender, studentId */}
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">
            Faculty
          </label>
          <input
            type="text"
            id="faculty"
            name="faculty"
            value={formData.faculty}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
            Student ID (Optional)
          </label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 text-white font-medium rounded-md shadow ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
