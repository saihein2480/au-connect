// src/app/profile/page.js

"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext"; // Assuming you're using AuthContext for user authentication

export default function ProfilePage() {
  const { role, userId } = useAuth(); // Retrieve role and userId from AuthContext
  const [profiles, setProfiles] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // State for the user's own profile
  const [newProfile, setNewProfile] = useState({
    displayName: "",
    username: "",
    email: "",
    faculty: "",
    gender: "",
    studentId: "",
    password: "", // Added password field
    role: "user", // Default role set to 'user'
  });
  const [editingProfile, setEditingProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const [inputPage, setInputPage] = useState(""); // Input for jumping to a specific page
  const profilesPerPage = 5; // Number of profiles per page

  // Fetch profiles on component mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoadingProfiles(true);
      const response = await fetch(`/api/profile`, {
        headers: {
          "user-id": userId,
          "user-role": role,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch profiles");
      const data = await response.json();

      if (role === "user") {
        const userProfileData = data.find((profile) => profile._id === userId);
        setUserProfile(userProfileData); // Set user's own profile
        setNewProfile(userProfileData); // Set the form to user's own data
      } else {
        setProfiles(data); // Admins can see all profiles
      }
    } catch (error) {
      setError("Failed to load profiles. Please try again later.");
    } finally {
      setLoadingProfiles(false);
    }
  };

  // Handle Save Profile (Create or Update)
  const handleSaveProfile = async () => {
    if (!newProfile.displayName || !newProfile.username || !newProfile.email) {
      setError("Display Name, Username, and Email are required.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const method = editingProfile || role === "user" ? "PUT" : "POST";
      const url = role === "user" ? `/api/profile/${userId}` : editingProfile ? `/api/profile/${editingProfile._id}` : `/api/profile`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
          "user-role": role,
        },
        body: JSON.stringify(newProfile), // Send data as JSON
      });

      if (!response.ok) throw new Error("Failed to save profile");

      const newProfileData = await response.json();
      setProfiles((prev) => {
        if (editingProfile || role === "user") {
          return prev.map((profile) => (profile._id === newProfileData._id ? newProfileData : profile));
        } else {
          return [newProfileData, ...prev];
        }
      });

      // Update user profile if the user is editing their own profile
      if (role === "user") {
        setUserProfile(newProfileData);
      }

      // Reset the form if the user is not editing their own profile
      if (role === "admin") {
        setNewProfile({
          displayName: "",
          username: "",
          email: "",
          faculty: "",
          gender: "",
          studentId: "",
          password: "",
          role: "user",
        });
      }
      
      setEditingProfile(null);
      setSuccess("Profile saved successfully.");
      fetchProfiles(); // Refresh the profile list
    } catch (error) {
      setError("Error saving profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete Profile (admin only)
  const handleDeleteProfile = async (id) => {
    try {
      const response = await fetch(`/api/profile/${id}`, {
        method: "DELETE",
        headers: {
          "user-id": userId,
          "user-role": role,
        },
      });

      if (!response.ok) throw new Error("Failed to delete profile");

      setProfiles((prev) => prev.filter((profile) => profile._id !== id));
      setSuccess("Profile deleted successfully.");
    } catch (error) {
      setError("Failed to delete profile. Please try again.");
    }
  };

  // Handle Editing Profile
  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
    setNewProfile({
      displayName: profile.displayName,
      username: profile.username,
      email: profile.email,
      faculty: profile.faculty,
      gender: profile.gender,
      studentId: profile.studentId,
      password: "", // Reset password for editing
      role: profile.role, // Set current role for editing
    });
  };

  // Pagination-related calculations
  const totalPages = Math.ceil(profiles.length / profilesPerPage);
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageInput = (e) => {
    const value = e.target.value;
    // Ensure that only numeric values are entered
    if (!isNaN(value) || value === "") {
      setInputPage(value);
    }
  };

  const jumpToPage = () => {
    const pageNumber = parseInt(inputPage, 10);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setError(""); // Clear any previous errors
    } else {
      setError(`Please enter a valid page number between 1 and ${totalPages}.`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8">Profile Management</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}

      {/* Display User's Own Profile */}
      {role === "user" && userProfile && (
        <>
          <h2 className="text-4xl font-semibold mb-6">Your Profile</h2>
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <p><strong>Display Name:</strong> {userProfile.displayName}</p>
            <p><strong>Username:</strong> {userProfile.username}</p>
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Faculty:</strong> {userProfile.faculty}</p>
            <p><strong>Gender:</strong> {userProfile.gender}</p>
            <p><strong>Student ID:</strong> {userProfile.studentId}</p>
          </div>
        </>
      )}

      {/* Form for Admins and Regular Users to Edit Profile */}
      {(role === "admin" || (role === "user" && userProfile)) && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold mb-6">
            {editingProfile ? "Edit Profile" : "Edit Your Profile"}
          </h2>

          <input
            type="text"
            placeholder="Display Name"
            className="mb-4 p-3 border rounded w-full"
            value={newProfile.displayName}
            onChange={(e) => setNewProfile({ ...newProfile, displayName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Username"
            className="mb-4 p-3 border rounded w-full"
            value={newProfile.username}
            onChange={(e) => setNewProfile({ ...newProfile, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="mb-4 p-3 border rounded w-full"
            value={newProfile.email}
            onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Faculty"
            className="mb-4 p-3 border rounded w-full"
            value={newProfile.faculty}
            onChange={(e) => setNewProfile({ ...newProfile, faculty: e.target.value })}
          />
          <input
            type="text"
            placeholder="Gender"
            className="mb-4 p-3 border rounded w-full"
            value={newProfile.gender}
            onChange={(e) => setNewProfile({ ...newProfile, gender: e.target.value })}
          />
          <input
            type="text"
            placeholder="Student ID"
            className="mb-4 p-3 border rounded w-full"
            value={newProfile.studentId}
            onChange={(e) => setNewProfile({ ...newProfile, studentId: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-4 p-3 border rounded w-full"
            value={newProfile.password}
            onChange={(e) => setNewProfile({ ...newProfile, password: e.target.value })}
          />
          {/* Admins can set the role; users cannot change their role */}
          {role === "admin" && (
            <select
              value={newProfile.role}
              onChange={(e) => setNewProfile({ ...newProfile, role: e.target.value })}
              className="mb-4 p-3 border rounded w-full"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button
            onClick={handleSaveProfile}
            className={`w-full py-3 mt-4 text-xl font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {editingProfile || role === "user" ? "Update Profile" : "Add Profile"}
          </button>
        </div>
      )}

      {/* Admin Only: Display Profiles */}
      {role === "admin" && (
        <>
          <h2 className="text-4xl font-semibold mb-6">Current Profiles</h2>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, username, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 border rounded w-full"
            />
          </div>

          {/* Display Profiles */}
          {currentProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProfiles
                .filter((profile) =>
                  ["displayName", "username", "email"].some((key) =>
                    profile[key]?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                )
                .map((profile) => (
                  <div key={profile._id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{profile.displayName}</h3>
                      <p>Username: {profile.username}</p>
                      <p>Email: {profile.email}</p>
                      <p>Faculty: {profile.faculty}</p>
                      <p>Gender: {profile.gender}</p>
                      <p>Student ID: {profile.studentId}</p>
                      <p>Role: {profile.role}</p>

                      <div className="flex space-x-4 mt-4">
                        <button
                          onClick={() => handleEditProfile(profile)}
                          className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(profile._id)}
                          className="py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            !loadingProfiles && <p className="text-lg font-medium text-gray-500 text-center">No profiles available.</p>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`py-2 px-4 ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-700"} text-white font-bold rounded`}
            >
              Previous
            </button>

            <span className="py-2 px-4 font-bold text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <input
              type="text"
              value={inputPage}
              onChange={handlePageInput}
              className="py-2 px-4 border rounded"
              placeholder="Page number"
            />
            <button
              onClick={jumpToPage}
              className="py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded"
            >
              Jump
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`py-2 px-4 ${currentPage === totalPages ? "bg-gray-300" : "bg-red-500 hover:bg-red-700"} text-white font-bold rounded`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
