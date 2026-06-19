import { Router } from 'express';
import { createItem } from '../controllers/itemController';
import { protect } from '../middleware/authMiddleware';
import { getItems, getItemById } from '../controllers/itemController';

const router = Router();

router.post('/add', protect as any, createItem);
router.get('/', getItems);
router.get('/:id', getItemById);

export default router;