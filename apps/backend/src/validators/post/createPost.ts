import { applyFieldAllowlist, sendValidationErrors } from '../handleValidation.ts';
import content from '../rules/content.ts';

const validateCreatePost = [
  content,
  sendValidationErrors,
  // userId is derived from the authenticated session in the controller and
  // imageUrl is a multer file upload — nothing else belongs in the body.
  applyFieldAllowlist(['content']),
];

export { validateCreatePost };
