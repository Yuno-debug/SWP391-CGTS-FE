import React from "react";
import "./Body.css";
import BodyBack from "../../../assets/BodyBack.jpg";
import GrowthImage from "../../../assets/growth.jpg";
import CheckupImage from "../../../assets/checkup.jpg";
import MilestoneImage from "../../../assets/milestones.png";
import DevelopmentImage from "../../../assets/milestone.jpg";

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
              {["Child Growth Tracking", "Nutrition and Health", "Milestone Tracker", "Developmental Milestones"].map((topic) => (
                <button key={topic} className="featured-topic-btn" onClick={() => handleTopicClick(topic)}>
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Section */}
          <div className="section-container two-column-layout">
            <div className="blog-container">
              <h2 className="blog-title">Blog</h2>
              {[
                {
                  title: "How to Track Your Child's Growth Effectively",
                  date: "January 20, 2025",
                  description: "Learn how to monitor your child's growth and ensure they are developing at a healthy rate.",
                  img: GrowthImage
                },
                {
                  title: "The Importance of Regular Health Checkups for Children",
                  date: "February 5, 2025",
                  description: "Discover why regular checkups are essential for early detection of potential health issues.",
                  img: CheckupImage
                },
                {
                  title: "Understanding Milestone Tracker for Kids",
                  date: "March 10, 2025",
                  description: "A guide to recommended tracker and when parents should calculate it.",
                  img: MilestoneImage
                },
                {
                  title: "Developmental Milestones: What to Expect and When",
                  date: "April 2, 2025",
                  description: "A breakdown of key developmental milestones and how to track your child's progress.",
                  img: DevelopmentImage
                }
              ].map((blog, index) => (
                <div key={index} className="blog-item">
                  <img src={blog.img} alt={blog.title} className="blog-image" />
                  <div className="blog-content">
                    <h3 className="blog-item-title">{blog.title}</h3>
                    <p className="blog-date">{blog.date}</p>
                    <p className="blog-description">{blog.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Parenting Tips Section */}
<div className="parenting-container">
  <h2 className="section-title">Parenting Tips</h2>
  {[
    "Healthy Eating Habits",
    "Encouraging Physical Activity",
    "Managing Screen Time",
    "Promoting Good Sleep Routines",
  ].map((tip) => (
    <div key={tip} className="parenting-card">
      <h3 className="parenting-title">{tip}</h3>
      <p className="parenting-text">
        Useful strategies to help with {tip.toLowerCase()}.
      </p>
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
