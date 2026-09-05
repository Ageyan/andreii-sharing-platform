import { Router } from "express";

import { createBooking, getMyBookings, getOwnerBookings, updateBookingStatus, cancelBooking } from "../controllers/bookingController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/owner', protect, getOwnerBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.patch('/:id/cancel', protect, cancelBooking);

export default router;