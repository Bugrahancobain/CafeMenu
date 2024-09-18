import React, { useState } from 'react'
import "../style/HomePage.css"
import LoadingLogo from "../assets/cafeMenuLogo.webp"
import { FaInstagram } from "react-icons/fa";
import Slider from "./Slider"
import Footer from "./Footer"
import ImageSlider from './ImageSlider';

function HomePage() {
  
  return (
    <div>
      <div className="navbar">
        <div className="navlogo">
          <a href="/">
          <img src={LoadingLogo} alt="LoadingLogo" />
          </a>
        </div>
        <div className="navLink">
          <a href="/" className="homelink">Anasayfa</a>
          <a href="/menu" className="homelink">Menu</a>
        </div>
        
        <a href='https://www.instagram.com/' target='_blank' className="navsocial">
          <button className='navsocialbtn'>
            <FaInstagram className='faInstagram'/> <div className="followInstagram">Bizi Takip Et</div>
          </button>
        </a>
        
      </div>
      <Slider />
      <ImageSlider/>
      <Footer />
    </div>
  )
}

export default HomePage