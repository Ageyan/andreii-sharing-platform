import { Router } from 'express';
import { createItem } from '../controllers/itemController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/add', protect as any, createItem);

export default router;