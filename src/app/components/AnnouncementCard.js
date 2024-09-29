// src/app/components/AnnouncementCard.js

"use client"; // Use client-side rendering for interactivity

import { useState } from 'react';

const AnnouncementCard = ({ announcement }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked); // Toggle the like state
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked); // Toggle the bookmark state
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 m-2">
      <h3 className="font-semibold text-lg">{announcement.title}</h3>
      <p>{announcement.content}</p>
      <div className="flex justify-between items-center mt-4">
        <button onClick={toggleLike} className={`text-sm ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
          {isLiked ? 'Unlike' : 'Like'}
        </button>
        <button onClick={toggleBookmark} className={`text-sm ${isBookmarked ? 'text-blue-500' : 'text-gray-500'}`}>
          {isBookmarked ? 'Unbookmark' : 'Bookmark'}
        </button>
      </div>
    </div>
  );
};

export default AnnouncementCard;
