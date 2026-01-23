import React from 'react'
import CardsPage from '../components/Cards'
import Navbar from '../components/Navbar'

export default function () {
    return (
       <main className="min-h-screen bg-linear-to-r from-[#f8f7ff] via-[#fff7f7] to-[#fffdf5]">
             <Navbar />
             <div className='h-32'></div>
             <CardsPage />
           </main>
    )
}
