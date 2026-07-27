import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getUserInfo, putUserUpdate, updateAvatar } from '../controllers/userController';
import { upload } from '../config/cloudinaryConfig';

const router = Router();

router.get('/profile', protect as any, getUserInfo);
router.put('/profile/update', protect as any, putUserUpdate);
router.patch('/profile/avatar', protect as any, upload.single('avatar'), updateAvatar)

export default router;