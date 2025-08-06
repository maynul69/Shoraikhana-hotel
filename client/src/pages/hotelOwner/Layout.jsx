import React from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import SidebBar from '../../components/hotelOwner/SidebBar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
      <div className='flex flex-col '>
          <Navbar />
          <div className='flex h-full'>
              <SidebBar />
              <div className='flex-1 p-4 md:px-10 h-full'>
                <Outlet />
              </div>
          </div>
    </div>
  )
}

export default Layout