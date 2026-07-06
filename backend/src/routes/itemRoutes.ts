import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { createItem, getItems, getItemById, getMyItems, deleteItemById } from '../controllers/itemController';
import { upload } from '../config/cloudinaryConfig';

const router = Router();

router.post('/add', protect as any, upload.array('images', 5) , createItem);
router.get('/', getItems);
router.get('/my', protect as any, getMyItems);
router.get('/:id', getItemById);
router.delete('/:id', protect as any, deleteItemById);

export default router;