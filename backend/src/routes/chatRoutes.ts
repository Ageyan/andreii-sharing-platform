import { Router } from "express";
import { getOrCreateChat, getUserChats } from "../controllers/chatController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post('/chats', protect, getOrCreateChat);
router.get('/chats', protect, getUserChats);

export default router;