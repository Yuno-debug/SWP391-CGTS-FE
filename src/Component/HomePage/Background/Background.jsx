import React, { useState, useEffect } from 'react';
import './Background.css';
import image1 from '../../../assets/image1.jpg';
import image2 from '../../../assets/image2.jpg';
import image3 from '../../../assets/image3.png';

const images = [image1, image2, image3];
const titles = ["Personal Child Tracking", "Avoid Obese", "Buy Membership"];
const positions = [
  { top: '50%', right: '120px', transform: 'translateY(-50%)' }, // Position for image 1
  { top: '50%', right: '300px', transform: 'translateY(-50%)' }, // Position for image 2
  { bottom: '300px', left: '200px' }  // Position for image 3
];
const urls = [
  "/membership", // URL for image 1
  "/membership", // URL for image 2
  "/membership" // URL for image 3
];

const Background = ({ playStatus }) => {
  const [heroCount, setHeroCount] = useState(0);

  useEffect(() => {
    if (!playStatus) {
      const interval = setInterval(() => {
        setHeroCount((prevCount) => (prevCount + 1) % images.length);
      }, 10000); // Change image every 10 seconds
      return () => clearInterval(interval);
    }
  }, [playStatus]);

  const handleDotClick = (index) => {
    setHeroCount(index);
  };

  return (
    <div className="background-container">
      {playStatus ? (
        <video className="background" autoPlay loop muted>
          <source src={video2} type="video/mp4" />
        </video>
      ) : (
        <>
          <img src={images[heroCount]} className="background fade" alt={`Background ${heroCount + 1}`} loading="lazy" />
          <div className="gradient-overlay"></div>
          <div className="content-overlay" style={positions[heroCount]}>
            <h1 className="title">{titles[heroCount]}</h1>
            <a href={urls[heroCount]} className="learn-more-button">Learn More</a>
          </div>
          <div className="navigation-dots">
            {titles.map((title, index) => (
              <span
                key={index}
                className={`dot ${heroCount === index ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              >
                {title}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Background;