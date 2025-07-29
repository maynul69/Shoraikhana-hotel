import React, { useEffect, useState } from 'react'
import { assets, roomsDummyData } from '../assets/assets';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';

const RoomDetails = () => {

    const { id } = useParams()
    const [room, setRoom]= useState(null);
    const [mainImage, setMainImage] = useState(null);
    
    useEffect(() => {
        const room = roomsDummyData.find(room => room._id === id)
        room && setRoom(room);
        room && setMainImage(room.images[0]);
    },[])
  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* room details  */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel.name}{" "}
            <span className="font-inner text-sm">({room.roomType})</span>
          </h1>
          <p className="text-xs font-inner py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>

        {/* room rating  */}
        <div className="flex items-center gap-1 mt-2">
          <StarRating />
          <p className="ml-2">200+reviews</p>
        </div>

        {/* room adress  */}

        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="" />
          <span>{room.hotel.address}</span>
              </div>
              
              {/* room images  */}

        <div className="flex flex-col lg:flex-row mt-6 gap-6">
                  <div className="lg:w-1/2 w-full">
                      <img src={mainImage} alt="" className="w-full rounded-xl shadow-lg object-cover" />
                  </div>
                  
        </div>


      </div>
    )
  );
}

export default RoomDetails