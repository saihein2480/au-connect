// src/app/utils/upload.js
import multer from 'multer';

// Setup Multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads'); // Define the upload folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Name the file uniquely
  }
});

const upload = multer({ storage });

export default upload;
