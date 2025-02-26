import React from "react";
import "./Body.css";
import BodyBack from "../../../assets/BodyBack.jpg";

const CDCBody = () => {
  const handleTopicClick = (topic) => {
    alert(`You have selected the topic: ${topic}`);
  };

  return (
    <div className="background-image">
      {/* Background Overlay */}
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
              {[
                "Child Growth Tracking",
                "Nutrition and Health",
                "Milestone Tracker",
                "Developmental Milestones",
              ].map((topic) => (
                <button
                  key={topic}
                  className="featured-topic-btn"
                  onClick={() => handleTopicClick(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Blog and Scientific Journals Section */}
          <div className="section-container two-column-layout">
            {/* Blog Section */}
            <div className="blog-container">
              <h2 className="blog-title">Blog</h2>
              {[
                {
                  title: "How to Track Your Child's Growth Effectively",
                  date: "January 20, 2025",
                  description:
                    "Learn how to monitor your child's growth and ensure they are developing at a healthy rate.",
                },
                {
                  title: "The Importance of Regular Health Checkups for Children",
                  date: "February 5, 2025",
                  description:
                    "Discover why regular checkups are essential for early detection of potential health issues.",
                },
                {
                  title: "Understanding Milestone Tracker for Kids",
                  date: "March 10, 2025",
                  description:
                    "A guide to recommended tracker and when parents should caculate it.",
                },
                {
                  title: "Developmental Milestones: What to Expect and When",
                  date: "April 2, 2025",
                  description:
                    "A breakdown of key developmental milestones and how to track your child's progress.",
                },
              ].map((blog, index) => (
                <div key={index} className="blog-item">
                  <h3 className="blog-item-title">{blog.title}</h3>
                  <p className="blog-date">{blog.date}</p>
                  <p className="blog-description">{blog.description}</p>
                </div>
              ))}
            </div>

            {/* Scientific Journals Section */}
            <div className="journal-container">
              <h2 className="section-title">Scientific Journals</h2>
              {[
                "MMWR",
                "Emerging Infectious Diseases",
                "PCD Preventing Chronic Disease",
              ].map((journal) => (
                <div key={journal} className="journal-card">
                  <h3 className="font-bold">{journal}</h3>
                  <p className="text-gray-600 text-sm">
                    Learn about recent studies...
                  </p>
                  <button className="mt-2 text-blue-600 hover:underline">
                    Learn More
                  </button>
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
