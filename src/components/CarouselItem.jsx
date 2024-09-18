import React from "react";
import { FaInstagram } from 'react-icons/fa';

export default function CarouselItem({ imgUrl, imgTitle }) {
  return (
    <div className="carousel-card">
      <img src={imgUrl} alt={imgTitle} />
      <div className="overlay">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="instagram-icon" />
        </a>
      </div>
    </div>
  );
}
