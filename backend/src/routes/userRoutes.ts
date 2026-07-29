import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getUserInfo, putUserUpdate, updateAvatar } from '../controllers/userController';
import { upload } from '../config/cloudinaryConfig';

const router = Router();

router.get('/profile', protect, getUserInfo);
router.put('/profile/update', protect, putUserUpdate);
router.patch('/profile/avatar', protect, upload.single('avatar'), updateAvatar)

export default router;