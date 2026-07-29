import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { createItem, getItems, getItemById, getMyItems, deleteItemById, updateItem } from '../controllers/itemController';
import { upload } from '../config/cloudinaryConfig';

const router = Router();

router.post('/add', protect, upload.array('images', 5) , createItem);
router.get('/', getItems);
router.get('/my', protect, getMyItems);
router.put('/my/update/:id', protect, upload.array('images', 5) , updateItem);
router.get('/:id', getItemById);
router.delete('/:id', protect, deleteItemById);

export default router;