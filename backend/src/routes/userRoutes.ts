import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getUserInfo, putUserUpdate} from '../controllers/userController';

const router = Router();

router.get('/profile', protect as any, getUserInfo);
router.put('/profile/update', protect as any, putUserUpdate);

export default router;