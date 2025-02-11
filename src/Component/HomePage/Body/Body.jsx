import React from "react";
import "./Body.css";
import BodyBack from "../../../assets/BodyBack.jpg";

const CDCBody = () => {
  return (
    <div className="background-image">
      {/* Background Image Section */}
      <div 
        className="background-overlay"
        style={{ backgroundImage: `url(${BodyBack})` }}
      >

      {/* Main Content */}
      <div className="main-content">
        {/* Featured Topics */}
        <div className="section-container">
          <h2 className="section-title">Featured Topics</h2>
          <div className="featured-topics-container">
            {["Wildfires and Air Safety", "Respiratory Illnesses", "Mpox Outbreak", "Orthopoxvirus Outbreak"].map((topic) => (
              <button key={topic} className="featured-topic-btn">
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* News Section */}
        <div className="section-container">
          <h2 className="section-title">News</h2>
          <ul className="space-y-2">
            {["U.S. Government Releases First National One Health Plan", "First Flu-Related Death Reported", "CDC Confirms First Case of H5N1 Bird Flu"].map((news, index) => (
              <li key={index} className="news-item">
                {news}
              </li>
            ))}
          </ul>
        </div>

        {/* Scientific Journals */}
        <div className="section-container">
          <h2 className="section-title">Scientific Journals</h2>
          <div className="journal-container">
            {["MMWR", "Emerging Infectious Diseases", "PCD Preventing Chronic Disease"].map((journal) => (
              <div key={journal} className="journal-card">
                <h3 className="font-bold">{journal}</h3>
                <p className="text-gray-600 text-sm">Learn about recent studies...</p>
                <button className="mt-2 text-blue-600 hover:underline">Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CDCBody;
