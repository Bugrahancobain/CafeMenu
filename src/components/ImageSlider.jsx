import React, { useEffect, useState } from 'react';
import "../style/ImageSlider.css"; // CSS dosyasını dahil ediyoruz
import { FaInstagram } from 'react-icons/fa'; // Instagram iconunu import ediyoruz

const images = [
  {
    src: 'https://image.lexica.art/full_webp/6796f9d8-56a7-4b95-a093-244658156907',
    link: 'https://instagram.com/', // Instagram linki
  },
  {
    src: 'https://image.lexica.art/full_webp/48895dea-289a-478f-af0a-a53ca9fe9547',
    link: 'https://instagram.com/',
  },
  {
    src: 'https://image.lexica.art/full_webp/32550047-29bd-4394-99a0-fb85e7f5aee5',
    link: 'https://instagram.com/',
  },
  {
    src: 'https://image.lexica.art/full_webp/1279f5a5-d400-4c7f-a20a-cfbe70ffd2d6',
    link: 'https://instagram.com/',
  },
  {
    src: 'https://image.lexica.art/full_webp/84962c70-2008-4ca4-8919-f853a9b12c99',
    link: 'https://instagram.com/',
  },
  {
    src: 'https://image.lexica.art/full_webp/e9611475-f454-44d2-9af6-890f28da38c3',
    link: 'https://instagram.com/',
  }
];

function ImageSlider() {
    return (
      <div className="slider">
        <div className="slider-wrapper animate">
          {images.map((image, index) => (
            <div className="slider-item" key={index}>
              <a href={image.link} target="_blank" rel="noopener noreferrer">
                <div className="image-container">
                  <img src={image.src} alt={`Slide ${index}`} />
                  <div className="overlay">
                    <FaInstagram className="instagram-icon" />
                  </div>
                </div>
              </a>
            </div>
          ))}
          {/* Sonsuz döngü için tekrarlanan görüntüler */}
          {images.map((image, index) => (
            <div className="slider-item" key={`duplicate-${index}`}>
              <a href={image.link} target="_blank" rel="noopener noreferrer">
                <div className="image-container">
                  <img src={image.src} alt={`Slide duplicate ${index}`} />
                  <div className="overlay">
                    <FaInstagram className="instagram-icon" />
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    );
}

export default ImageSlider;
