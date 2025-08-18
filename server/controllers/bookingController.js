import Booking from "../models/Booking"
import Hotel from "../models/hotel";
import Room from "../models/room";


// function to check if the room is available
export const checkAvailability = async ({ room, checkInDate, checkOutDate }) => { 
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate},
            checkOutDate: { $gte: checkInDate},
        })
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
    }
}

//api to check room availability
//POST/api/bookings/check-availability

export const checkAvailabilityAPI = async (req, res) => { 
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// api to create a booking
// POST /api/bookings/book

export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;
        //check if the room is available before bookig

        const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });

        if (!isAvailable) {
            return res.json({ success: false, message: "Room is not available " });
        }

        // get total price for room 
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = timeDiff / (1000 * 3600 * 24);
        totalPrice *= nights;

        const bookig = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice
        });
        res.json({ success: true, message: "Booking created successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Boooking failed" });
    }
};

// api to get all bookings for a user
// GET /api/bookings/user

export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" });
    }
}
 
// api to get all bookings for a hotel owner
// GET /api/bookings/owner

export const getHotelBookings = async (req, res) => { 
    try {
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
        return res.json({success:false, message:"No hotel found"})
    }
    const bookings = await Booking.find({ hotel: Hotel._id }).populate("room hotel user").sort({ createdAt: -1 });

    //Total Bookings
    const totalBookings = bookings.length; 
    //total revenue
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.json({ success: true, dashboardData: {totalBookings, totalRevenue, bookings} });
    } catch (error) {
        res.json({ success: false, message: "failed to fetch bookings" });
    }
}

