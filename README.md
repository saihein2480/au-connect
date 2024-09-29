# AU Connect

## App Description

   AU Connect is a web-based platform designed to enhance communication within the Assumption University community. It provides tools for managing announcements, user profiles, and contacts, with separate functionalities for admins and regular users. The platform is designed to be scalable and secure, with role-based access control.

   "We developed the project locally and deployed it on a GitHub page and Vercel, sharing the links. Please note that the contributions were not made through GitHub."

---

## Team Member

1.  SAI HEIN THU YA SOE - https://github.com/saihein2480/au-connect
2.  GEORGE OBINNA OGUEJIOFOR - https://github.com/oGeorge88/au-connect3.git

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Setup Guide](#setup-guide)
5. [Environment Variables](#environment-variables)
6. [API Endpoints](#api-endpoints)
   - [Announcements](#announcements)
   - [Authentication](#authentication)
   - [Contacts](#contacts)
   - [Profiles](#profiles)
7. [Running the Project](#running-the-project)
8. [Folder Structure](#folder-structure)
9. [Project Walkthrough](#project-walkthrough)
10. [Admin vs User Functionalities](#admin-vs-user-functionalities)
11. [Error Handling](#error-handling)
12. [Future Improvements](#future-improvements)

---

## Project Overview

AU Connect is built to serve students, faculty, and admins by providing a centralized platform for announcements and user profile management. Admins can manage announcements, user accounts, and contacts, while users can view announcements, bookmark content, and manage their own profiles.

The platform uses **Next.js** for the frontend and **Next.js** for the backend, with data persistence powered by **MongoDB**. The project implement role-based access control to ensure that only authorized users can perform certain actions.

---

## Features

### General Features

- **Responsive Design**: Works well on desktop and mobile devices.
- **Announcements**: Admins can create, edit, and delete announcements; users can view and bookmark them.
- **Profile Management**: Users can manage their own profile, while admins can manage all user profiles.
- **Contact Management**: Admins can add, edit, and delete contacts; users can view contacts.

---

## Tech Stack

### Frontend:

- [**Next.js**](https://nextjs.org/) - Server-side rendering and static site generation
- [**Tailwind CSS**](https://tailwindcss.com/) - Utility-first CSS framework
- [**React**](https://reactjs.org/) - Component-based frontend framework

### Backend:

- [**Next.js**](https://nextjs.org/) - Server-side rendering and static site generation
- [**MongoDB**](https://www.mongodb.com/) - NoSQL database for data persistence
- [**Mongoose**](https://mongoosejs.com/) - MongoDB object modeling tool for Node.js

### Other Tools:

- **Bcrypt.js** for password hashing
- **FormData** API for handling file uploads
- **React-Quill** for rich-text editing

---

## Setup Guide

### Prerequisites

Ensure that you have the following installed on your machine:

- **Node.js** (v14 or higher)
- **MongoDB Atlas** or a locally running MongoDB instance

### Step-by-Step Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo-url
   cd au-connect
   ```
2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables: Create a .env.local file in the project root with the following environment variables:

   ```
   SESSION_SECRET=yourSuperSecretKeyHere1234
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   CREATE_ADMIN_VERIFY=your_admin_creation_code
   ```

4. Run the application: To start the development server:

   ```
   npm run dev
   ```

---

## Environment Variables

Required Variables
MONGODB_URI: MongoDB connection string (replace your_mongodb_connection_string with your actual connection string).
NEXT_PUBLIC_API_BASE_URL: Base URL of the API (defaults to http://localhost:3000 for local development).
CREATE_ADMIN_VERIFY: A verification code required for creating admin accounts during signup.

---

## API Endpoints

### Announcements

#### Method Endpoint Description Access

GET /api/announcement Fetch all announcements Public
GET /api/announcement/[id] Fetch a specific announcement by ID Public
POST /api/announcement Create a new announcement Admin
PUT /api/announcement/[id] Update an announcement by ID Admin
DELETE /api/announcement/[id] Delete an announcement by ID Admin

### Authentication

#### Method Endpoint Description Access

POST /api/auth/login Login with username and password Public
POST /api/auth/signup Signup (with role verification) Public

### Contacts

#### Method Endpoint Description Access

GET /api/contacts Fetch all contacts Public
POST /api/contacts Add a new contact Admin
PUT /api/contacts/[id] Update an existing contact by ID Admin
DELETE /api/contacts/[id] Delete a contact by ID Admin

### Profiles

#### Method Endpoint Description Access

GET /api/profile Fetch all profiles Admin
GET /api/profile/[id] Fetch a specific user profile User/Admin
POST /api/profile Create a new profile Admin
PUT /api/profile/[id] Update a user profile by ID User/Admin
DELETE /api/profile/[id] Delete a profile by ID Admin

---

## Running the Project

### Running the Frontend

To start the frontend (Next.js) development server:
`   npm run dev
  `

This will start the frontend on <http://localhost:3000>.

---

## Running the Backend

The backend is integrated within the Next.js framework (API routes). No separate server is required.

---

## Folder Structure

.
├── app
│ ├── api # API routes (auth, announcements, contacts, profiles)
│ ├── components # Reusable components (Navbar, Footer, ErrorBoundary)
│ ├── models # MongoDB models (User, Announcement, Contact)
│ ├── utils # Utility functions (dbConnect for MongoDB connection)
│ ├── login # Login page
│ ├── signup # Signup page
│ └── layout.js # Global layout (Navbar, Footer)
└── public
└── uploads # Stores uploaded images (profile pictures, cover images)

---

## Project Walkthrough

### Authentication Flow

Login: Users and admins can log in with their username and password. If valid, The user is redirected based on their role.

Signup: New users can sign up, and admins must provide a verification code to create an admin account. Passwords are hashed before being saved to the database.

### Announcements

Admin: Admins can create new announcements by filling in the title, content (rich text), and optional cover image. Announcements are displayed in reverse chronological order.
User: Users can view and bookmark announcements for quick access.

### Profile Management

User: Each user can view and edit their own profile, including updating their display name, email, and password.
Admin: Admins can view, add, edit, and delete profiles of all users.

---

## Admin vs User Functionalities

#### Feature Admin User

Announcements Create, Edit, Delete View, Bookmark
Profile View/Add/Edit/Delete all View/Edit own
Contacts Add, Edit, Delete View

---

## Error Handling

Error Boundary: React components are wrapped in an ErrorBoundary to gracefully catch and display any unexpected errors during rendering.
Backend Errors: Each API route returns a clear and descriptive error message if something goes wrong (e.g., invalid input, database connection failure).

---

## Future Improvements

Search Feature: Implement a global search bar to allow users to quickly search through announcements, contacts, and profiles.
Notification System: Add real-time notifications to inform users of new announcements.
Role-Based Permissions: Expand the permissions system to allow for more granular access control (e.g., editors, moderators).
File Management: Implement a file storage service like AWS S3 for handling cover images and profile pictures more efficiently.
Improved Pagination: Add infinite scrolling or more advanced pagination for announcements and contacts.

---

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
This detailed `README.md` explains the project, how to set it up, and walks through the core functionalities. It also covers error handling and potential improvements, ensuring anyone taking over can understand the project and contribute effectively.

---

# Home Page

![Screenshot 2024-09-29 191223](https://github.com/user-attachments/assets/69f830da-7717-4865-868c-483d04893f04)

# Sign Up
![Screenshot 2024-09-29 191234](https://github.com/user-attachments/assets/7f2684d0-0081-4fbb-8d6b-575cfc64f9fb)

# Log In
![Screenshot 2024-09-29 191240](https://github.com/user-attachments/assets/996aa04a-2b9b-49e8-8a43-8b6cd94fac85)

# Admin Home Page
![Screenshot 2024-09-29 191300](https://github.com/user-attachments/assets/f0d97f22-d484-4fa2-8e61-7238655cd422)

# Admin Profile Page
![Screenshot 2024-09-29 191308](https://github.com/user-attachments/assets/9337f5a4-6459-4585-96b5-6b331277bce6)

# Admin Contact Page
![Screenshot 2024-09-29 191314](https://github.com/user-attachments/assets/3330c837-1ef8-4961-9de3-64fdd1576411)

# User Home Page
![Screenshot 2024-09-29 191427](https://github.com/user-attachments/assets/7bc15341-8a72-49f8-8eb7-63fc17db8f94)

# User Profile Page
![Screenshot 2024-09-29 191433](https://github.com/user-attachments/assets/286aa7b8-3193-4b46-8315-19349735440c)

# User Contact Page
![Screenshot 2024-09-29 191445](https://github.com/user-attachments/assets/58e808ac-1697-46db-a848-fbd1d83ca4dc)
