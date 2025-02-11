import React from 'react'
import './Hero.css'
const Hero = () => {
  return (
    <div className="contentWrapper">
        <h1 className="title">Track growth of baby</h1>
        <button className="ctaButton">
          <span>Learn More</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9c274cd1122d98c7725fdcd00806ee26d7be5c4b5abccc087a25122812df2ab1?placeholderIfAbsent=true&apiKey=4b2823083f6443d6bf7b2e849ae2d3e3"
            alt=""
            className="buttonIcon"
          />
        </button> 
      </div>
  )
}

export default Hero
