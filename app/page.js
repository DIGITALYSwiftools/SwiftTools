import React from 'react'
import Home from './home/page'
import Cards from './components/Cards'
import Footer from './components/Footer'

function page() {
  return (
    <div>
      <Home/>
      <Cards/>
      <Footer/>
    </div>
  )
}

export default page