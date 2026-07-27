import { Router } from "express";
import { createBooking, getMyBookings, getOwnerBookings, updateBookingStatus, cancelBooking } from "../controllers/bookingController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post('/', protect as any, createBooking);
router.get('/my', protect as any, getMyBookings);
router.get('/owner', protect as any, getOwnerBookings);
router.put('/:id/status', protect as any, updateBookingStatus);
router.patch('/:id/cancel', protect as any, cancelBooking);

export default router;