// src/app/page.js

"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useAuth } from "./AuthContext";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

export default function HomePage() {
  const { isLoggedIn, role } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination and filtering states
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [inputPage, setInputPage] = useState(""); // For jump to specific page

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    applyFiltersAndSort(); // Apply filters and sorting whenever dependencies change
  }, [searchTerm, sortOption, announcements]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcement");
      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }
      const data = await response.json();
      setAnnouncements(data); // Set fetched announcements
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError("Failed to load announcements. Please try again later.");
    }
  };

  const applyFiltersAndSort = () => {
    // Create a new copy of the announcements array to avoid mutating the original state
    let filtered = [...announcements];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((announcement) =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by the selected option
    if (sortOption === "newest") {
      filtered = filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortOption === "oldest") {
      filtered = filtered.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sortOption === "title") {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredAnnouncements(filtered); // Update the filtered announcements state
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSaveAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      setError("Title and Content cannot be empty.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", newAnnouncement.title);
      formData.append("content", newAnnouncement.content);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      const method = editingAnnouncement ? "PUT" : "POST";
      const url = editingAnnouncement
        ? `/api/announcement/${editingAnnouncement._id}`
        : "/api/announcement";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save announcement");

      const updatedAnnouncement = await response.json();

      setAnnouncements((prev) =>
        editingAnnouncement
          ? prev.map((ann) =>
              ann._id === updatedAnnouncement._id ? updatedAnnouncement : ann
            )
          : [updatedAnnouncement, ...prev]
      );

      setNewAnnouncement({ title: "", content: "" });
      setCoverImage(null);
      setEditingAnnouncement(null);
      fetchAnnouncements();
    } catch (error) {
      console.error("Error saving announcement:", error);
      setError("Error saving announcement. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await fetch(`/api/announcement/${id}`, { method: "DELETE" });
      setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  // Handle pagination
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement =
    indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePageInput = (e) => {
    const value = e.target.value;
    if (!isNaN(value) || value === "") {
      setInputPage(value);
    }
  };

  const jumpToPage = () => {
    const pageNumber = parseInt(inputPage, 10);
    const totalPages = Math.ceil(
      filteredAnnouncements.length / announcementsPerPage
    );

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setError("");
    } else {
      setError(`Please enter a valid page number between 1 and ${totalPages}.`);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(
      filteredAnnouncements.length / announcementsPerPage
    );
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8">
        AU Connect Announcements
      </h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {role === "admin" && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold mb-6">
            {editingAnnouncement ? "Edit Announcement" : "Add Announcement"}
          </h2>

          <label className="block text-xl font-medium mb-2">Title</label>
          <input
            type="text"
            placeholder="Title"
            className="mb-4 p-3 border rounded w-full focus:ring focus:border-blue-300"
            value={newAnnouncement.title}
            onChange={(e) =>
              setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
            }
          />

          <label className="block text-xl font-medium mb-2">Content</label>
          <ReactQuill
            value={newAnnouncement.content}
            onChange={(content) =>
              setNewAnnouncement({ ...newAnnouncement, content })
            }
            className="mb-4"
            modules={modules}
          />

          <label className="block text-xl font-medium mb-2">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="mb-4 p-3 border rounded w-full focus:ring focus:border-blue-300"
          />

          <button
            onClick={handleSaveAnnouncement}
            className={`w-full py-3 mt-4 text-xl font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {editingAnnouncement ? "Update Announcement" : "Add Announcement"}
          </button>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}

      <h2 className="text-4xl font-semibold mb-6">Latest Announcements</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border rounded w-full mb-2"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-3 border rounded w-full mb-2"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>

      {filteredAnnouncements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentAnnouncements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl"
            >
              {announcement.coverImage && (
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={`/uploads/${announcement.coverImage}`}
                    alt={announcement.title}
                    width={400}
                    height={200}
                    className="w-full h-50 object-cover"
                  />
                </div>
              )}

              <div className="p-6 flex-grow">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {announcement.title}
                </h3>
                <div
                  className="text-gray-700 mb-4"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
                <p className="text-sm text-gray-500">
                  Posted on:{" "}
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 flex items-center justify-between bg-gray-100">
                {role === "admin" && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setEditingAnnouncement(announcement);
                        setNewAnnouncement({
                          title: announcement.title,
                          content: announcement.content,
                        });
                      }}
                      className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement._id)}
                      className="py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg font-medium text-gray-500 text-center">
          No announcements available.
        </p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`py-2 px-4 ${
            currentPage === 1 ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold rounded`}
        >
          Previous
        </button>

        <span className="py-2 px-4 font-bold text-gray-700">
          Page {currentPage} of{" "}
          {Math.ceil(filteredAnnouncements.length / announcementsPerPage)}
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
          className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
        >
          Jump
        </button>

        <button
          onClick={handleNextPage}
          disabled={
            currentPage ===
            Math.ceil(filteredAnnouncements.length / announcementsPerPage)
          }
          className={`py-2 px-4 ${
            currentPage ===
            Math.ceil(filteredAnnouncements.length / announcementsPerPage)
              ? "bg-gray-300"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold rounded`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
