"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../AuthContext";

export default function ContactPage() {
  const { isLoggedIn, role } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    faculty: "",
    role: "",
    department: "",
    email: "",
    phone: "",
    facebook: "",
    line: "",
    gender: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("");
  const contactsPerPage = 5;

  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      setLoadingContacts(true);
      const response = await fetch(`/api/contacts`);
      if (!response.ok) throw new Error("Failed to fetch contacts");

      const data = await response.json();
      setContacts(data);
      setFilteredContacts(data);
    } catch (error) {
      setError("Failed to load contacts. Please try again later.");
    } finally {
      setLoadingContacts(false);
    }
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  // Save contact (create or update)
  const handleSaveContact = async () => {
    if (!newContact.name || !newContact.faculty || !newContact.role || !newContact.gender) {
      setError("Name, Faculty, Role, and Gender are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      Object.entries(newContact).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const method = editingContact ? "PUT" : "POST";
      const url = editingContact
        ? `/api/contacts/${editingContact._id}`
        : `/api/contacts`;

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save contact");

      const updatedContact = await response.json();

      setContacts((prev) =>
        editingContact
          ? prev.map((contact) =>
              contact._id === updatedContact._id ? updatedContact : contact
            )
          : [updatedContact, ...prev]
      );

      setNewContact({
        name: "",
        faculty: "",
        role: "",
        department: "",
        email: "",
        phone: "",
        facebook: "",
        line: "",
        gender: "",
      });
      setProfilePicture(null);
      setEditingContact(null);
      fetchContacts(); // Refresh contact list
    } catch (error) {
      setError("Error saving contact. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete contact
  const handleDeleteContact = async (id) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete contact");

      setContacts((prev) => prev.filter((contact) => contact._id !== id));
    } catch (error) {
      setError("Failed to delete contact. Please try again.");
    }
  };

  // Handle filtering and sorting together
  useEffect(() => {
    const filtered = contacts
      .filter((contact) => {
        return (
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .sort((a, b) => {
        const fieldA = a[sortField]?.toLowerCase() || "";
        const fieldB = b[sortField]?.toLowerCase() || "";

        if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });

    setFilteredContacts(filtered);
  }, [searchTerm, sortField, sortOrder, contacts]);

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  const handlePageInput = (e) => {
    const value = e.target.value;
    if (!isNaN(value) || value === "") {
      setInputPage(value);
    }
  };

  const jumpToPage = () => {
    const pageNumber = parseInt(inputPage, 10);
    const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setError("");
    } else {
      setError(`Please enter a valid page number between 1 and ${totalPages}.`);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
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
        Contact List
      </h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {role === "admin" && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold mb-6">
            {editingContact ? "Edit Contact" : "Add Contact"}
          </h2>

          {/* Form to add/edit contact */}
          <label className="block text-xl font-medium mb-2">Name</label>
          <input
            type="text"
            placeholder="Name"
            className="mb-4 p-3 border rounded w-full"
            value={newContact.name}
            onChange={(e) =>
              setNewContact({ ...newContact, name: e.target.value })
            }
          />

          <label className="block text-xl font-medium mb-2">Faculty</label>
          <input
            type="text"
            placeholder="Faculty"
            className="mb-4 p-3 border rounded w-full"
            value={newContact.faculty}
            onChange={(e) =>
              setNewContact({ ...newContact, faculty: e.target.value })
            }
          />

          <label className="block text-xl font-medium mb-2">Role</label>
          <input
            type="text"
            placeholder="Role"
            className="mb-4 p-3 border rounded w-full"
            value={newContact.role}
            onChange={(e) =>
              setNewContact({ ...newContact, role: e.target.value })
            }
          />

          <label className="block text-xl font-medium mb-2">Department</label>
          <input
            type="text"
            placeholder="Department"
            className="mb-4 p-3 border rounded w-full"
            value={newContact.department}
            onChange={(e) =>
              setNewContact({ ...newContact, department: e.target.value })
            }
          />

          <label className="block text-xl font-medium mb-2">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="mb-4 p-3 border rounded w-full"
            value={newContact.email}
            onChange={(e) =>
              setNewContact({ ...newContact, email: e.target.value })
            }
          />

          <label className="block text-xl font-medium mb-2">Phone</label>
          <input
            type="tel"
            placeholder="Phone"
            className="mb-4 p-3 border rounded w-full"
            value={newContact.phone}
            onChange={(e) =>
              setNewContact({ ...newContact, phone: e.target.value })
            }
          />

          <label className="block text-xl font-medium mb-2">Facebook</label>
          <input
            type="text"
            placeholder="Facebook"
            className="mb-4 p-3 border rounded w-full"
            value={newContact.facebook}
            onChange={(e) =>
              setNewContact({ ...newContact, facebook: e.target.value })
            }
          />

          <label className="block text-xl font-medium mb-2">Line</label>
          <input
            type="text"
            placeholder="Line"
            className="mb-4 p-3 border rounded w-full"
            value={newContact.line}
            onChange={(e) =>
              setNewContact({ ...newContact, line: e.target.value })
            }
          />

          <label className="block text-xl font-medium mb-2">Gender</label>
          <input
            type="text"
            placeholder="Gender"
            className="mb-4 p-3 border rounded w-full"
            value={newContact.gender}
            onChange={(e) =>
              setNewContact({ ...newContact, gender: e.target.value })
            }
          />

          <label className="block text-xl font-medium mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="mb-4 p-3 border rounded w-full"
          />

          <button
            onClick={handleSaveContact}
            className={`w-full py-3 mt-4 text-xl font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {editingContact ? "Update Contact" : "Add Contact"}
          </button>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}

      <h2 className="text-4xl font-semibold mb-6">Current Contacts</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, faculty, role, or department"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border rounded w-full"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="mb-4">
        <label className="block text-xl font-medium mb-2">Sort by</label>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="p-3 border rounded w-full mb-2"
        >
          <option value="name">Name</option>
          <option value="faculty">Faculty</option>
          <option value="role">Role</option>
          <option value="department">Department</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-3 border rounded w-full"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentContacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
            >
              {contact.profilePicture && (
                <div className="relative flex justify-center items-center">
                <div className="relative w-40 h-40">
                  <Image
                    src={`/uploads/${contact.profilePicture}`}
                    alt={contact.name}
                    layout="fill" // Ensure it fills the container
                    objectFit="cover" // Ensures the image covers the area without being distorted
                    className="rounded-full border-4 border-white shadow-lg" // Rounded with a border and shadow
                  />
                  
                </div>
              </div>
              
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {contact.name}
                </h3>
                {contact.faculty && <p>Faculty: {contact.faculty}</p>}
                {contact.role && <p>Role: {contact.role}</p>}
                {contact.department && <p>Department: {contact.department}</p>}

                {contact.email && (
                  <p>
                    Email:{" "}
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-blue-500 underline"
                    >
                      {contact.email}
                    </a>
                  </p>
                )}
                {contact.phone && <p>Phone: {contact.phone}</p>}
                {contact.facebook && <p>Facebook: {contact.facebook}</p>}
                {contact.line && <p>Line: {contact.line}</p>}

                {role === "admin" && (
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => {
                        setEditingContact(contact);
                        setNewContact({
                          name: contact.name,
                          faculty: contact.faculty,
                          role: contact.role,
                          department: contact.department,
                          email: contact.email,
                          phone: contact.phone,
                          facebook: contact.facebook,
                          line: contact.line,
                          gender: contact.gender,
                        });
                      }}
                      className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact._id)}
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
        !loadingContacts && (
          <p className="text-lg font-medium text-gray-500 text-center">
            No contacts available.
          </p>
        )
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`py-2 px-4 ${
            currentPage === 1 ? "bg-gray-300" : "bg-red-500 hover:bg-red-700"
          } text-white font-bold rounded`}
        >
          Previous
        </button>

        <span className="py-2 px-4 font-bold text-gray-700">
          Page {currentPage} of{" "}
          {Math.ceil(filteredContacts.length / contactsPerPage)}
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
          disabled={currentPage === Math.ceil(filteredContacts.length / contactsPerPage)}
          className={`py-2 px-4 ${
            currentPage === Math.ceil(filteredContacts.length / contactsPerPage)
              ? "bg-gray-300"
              : "bg-red-500 hover:bg-red-700"
          } text-white font-bold rounded`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
