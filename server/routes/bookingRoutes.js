
import express from "express";
 import { protect } from "../middleware/authMiddleware";
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings } from "../controllers/bookingController";

const bookingRouter = express.Router();


bookingRouter.post('/check-availability',checkAvailabilityAPI)
bookingRouter.post('/book', protect, createBooking);    
bookingRouter.post('/user', protect, getUserBookings);
bookingRouter.post('/hotel', protect, getHotelBookings);

export default bookingRouter;
