// import multer from "multer"

// const upload = multer({ storage: multer.diskStorage() })
// export default upload;


// import multer from "multer";
// import path from "path";

// // Configure storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // folder where files will be stored
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // unique filename
//   }
// });

// // Init multer with storage
// const upload = multer({ storage });

// export default upload;


import multer from "multer";

const storage = multer.memoryStorage(); // keep files in memory
const upload = multer({ storage });

export default upload;
