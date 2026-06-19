import { Router } from "express";
import { createBooking, getMyBookings, getOwnerBookings } from "../controllers/bookingController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post('/', protect as any, createBooking);
router.get('/my', protect as any, getMyBookings);
router.get('/owner', protect as any, getOwnerBookings);


export default router;