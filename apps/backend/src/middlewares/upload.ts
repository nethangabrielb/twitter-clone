import multer from 'multer';

// Server-side enforcement of the image upload policy. The 5MB cap used to be
// client-side only and trivially bypassed by calling the API directly, which
// buffered the whole upload into memory with no size limit. Only allow image
// mimetypes so non-image files never reach the public Supabase URL.
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    const error = new multer.MulterError(
      'UNSUPPORTED_FILE_TYPE' as multer.MulterError['code'],
      file.fieldname
    );
    error.message = 'Only image files (JPEG, PNG, WebP, GIF) are allowed.';
    cb(error);
  },
});
