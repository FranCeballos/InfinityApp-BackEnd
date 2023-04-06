const multer = require("multer");

///// DiskStorage Configurations
const fileStorageProductImages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/products");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileStorageAvatars = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

///// Filter configurations
const fileFilter = (req, file, cb) => {
  const fileMimetype = file.mimetype;
  if (
    fileMimetype === "image/jpg" ||
    fileMimetype === "image/jpeg" ||
    fileMimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//// Multer middleware

exports.uploadProductImage = multer({
  storage: fileStorageProductImages,
  fileFilter: fileFilter,
});

exports.uploadAvatarImage = multer({
  storage: fileStorageAvatars,
  fileFilter: fileFilter,
});
