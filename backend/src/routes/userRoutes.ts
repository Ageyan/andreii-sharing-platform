import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getuserInfo } from '../controllers/userController';

const router = Router();

router.get('/profile', protect as any, getuserInfo);

export default router;