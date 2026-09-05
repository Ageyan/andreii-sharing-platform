import { Router } from "express";

import { getOrCreateChat, getUserChats, getChatMessages, getUnreadMessages, updateStatusMessages } from "../controllers/chatController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post('/chats', protect, getOrCreateChat);
router.get('/chats', protect, getUserChats);
router.get('/chats/messages/unread', protect, getUnreadMessages);
router.patch('/chats/:id/messages/read', protect, updateStatusMessages);
router.get('/chats/:id/messages', protect, getChatMessages);

export default router;