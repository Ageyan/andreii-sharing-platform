import { Router } from "express";
import { getOrCreateChat, getUserChats, getChatMessages } from "../controllers/chatController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post('/chats', protect, getOrCreateChat);
router.get('/chats', protect, getUserChats);
router.get('/chats/:id/messages', protect, getChatMessages);

export default router;