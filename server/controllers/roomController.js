import Hotel from "../models/hotel";


// api to create a room for hotel
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenitites, images } = req.body;
        consthotel = await Hotel.findOne({ owner: req.auth.userId });
        
        if(!hotel) return res.json({ success: false, message: "Hotel not found" });
    } catch (error) {
        
    }
 }


// api to get all rooms

export const getRooms = async (req, res) => { }


// api to get all rooms for a specific hotel

export const getOwnerRooms = async (req, res) => { }


// api to get toggle availability of a room

export const toggleRoomAvailability = async (req, res) => { }