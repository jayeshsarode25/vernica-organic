import React from 'react'
import ProductCategory from '../components/products/ProductCategory'
import ProductShow from '../components/products/ProductShow'
import DemoProduct from '../components/products/DemoProduct'  
import TestimonialSection from '../components/testimonial'
import ProductSell from '../components/products/ProductSell'
import DamiSell from '../components/products/DamiSell'
import Footer from './Footer'
import Navbar from '../components/Navbar/Navbar'
import HeaderBar from '../components/HeaderBar'


const Home = () => {
  return (
    <div className='h-full '>
      <HeaderBar />
      <Navbar />
      <ProductShow/>
      <ProductCategory />
      <DemoProduct />
      <TestimonialSection />
      <ProductSell />
      <DamiSell />
      <Footer />
    </div>
  )
}

export default Home