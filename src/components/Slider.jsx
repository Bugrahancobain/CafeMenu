import React, { useState, useEffect } from 'react';
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';
import ComponentC from './ComponentC';
import '../style/Slider.css'; // CSS dosyası

const Slider = ({ interval = 5000 }) => {
  const components = [<ComponentA />, <ComponentB />, <ComponentC />];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === components.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(autoSlide);
  }, [components.length, interval]);

  return (
    <div className="slider-container">
      <div
        className="slider-wrapper"
        style={{ transform: `translateX(-${currentIndex * 100}vw)` }} // Aktif slide'ı kaydır
      >
        {components.map((Component, index) => (
          <div key={index} className="slide">
            {Component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
