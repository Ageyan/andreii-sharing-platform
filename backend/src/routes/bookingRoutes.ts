import { Router } from "express";
import { createBooking, getMyBookings, getOwnerBookings, updateBookingStatus } from "../controllers/bookingController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post('/', protect as any, createBooking);
router.get('/my', protect as any, getMyBookings);
router.get('/owner', protect as any, getOwnerBookings);
router.put('/:id/status', protect as any, updateBookingStatus);


export default router;