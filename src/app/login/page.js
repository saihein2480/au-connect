// src/app/login/page.js

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext"; // Assuming AuthContext is correctly set up
import Link from "next/link"; // Use Next.js Link for navigation

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();
  const { login } = useAuth(); // Use login from AuthContext to update login state

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    setIsLoading(true); // Start loading

    try {
      // Send login request to the backend
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login: save login state and redirect
        login({ role: data.role, userId: data.userId });

        window.alert(
          `Login successful! Welcome ${
            data.role === "admin" ? "Admin" : "User"
          }.`
        );
        router.push("/"); // Redirect to home page or dashboard
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      setError("An error occurred while trying to log in.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="container mx-auto px-4">
      <form
        onSubmit={handleLogin}
        className="max-w-sm mx-auto bg-white p-6 rounded shadow-md mt-10"
      >
        <h2 className="text-center text-2xl font-bold mb-4">Log In</h2>

        {error && (
          <p className="text-red-500 text-center mb-4" aria-live="assertive">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-indigo-300"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-indigo-300"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 text-white font-medium rounded-md shadow ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>

        <p className="mt-4 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
