import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Body.css";

const CDCBody = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleTopicClick = (topic) => {
    navigate("/blog", { state: { topic } });
  };

  const handleLearnMoreClick = () => {
    navigate("/blog");
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="cdc-body">
      <div className="cdc-body__overlay">
        <div className="cdc-body__content">
          {/* Featured Topics */}
          <section className="featured-topics">
            <h2 className="section-title">Featured Topics</h2>
            <div className="featured-topics__list">
              {[
                { topic: "Child Growth Tracking", icon: "📈" },
                { topic: "Nutrition and Health", icon: "🍎" },
                { topic: "Milestone Tracker", icon: "🏆" },
                { topic: "Developmental Milestones", icon: "🧠" },
              ].map(({ topic, icon }) => (
                <button
                  key={topic}
                  className="featured-topics__btn"
                  onClick={() => handleTopicClick(topic)}
                >
                  {topic} <span className="featured-topics__icon">{icon}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Blog Section */}
          <section className="blog-section">
            <div className="blog-section__content">
              <h2 className="section-title">Advertise</h2>
              {[
                {
                  title: "How to Track Your Child's Growth Effectively",
                  date: "January 20, 2025",
                  description:
                    "Learn how to monitor your child's growth and ensure they are developing at a healthy rate.",
                  img: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=800&auto=format&fit=crop",
                },
                {
                  title: "The Importance of Regular Health Checkups for Children",
                  date: "February 5, 2025",
                  description:
                    "Discover why regular checkups are essential for early detection of potential health issues.",
                  img: "https://weecarepediatrics.com/wp-content/uploads/2023/02/patient-checkup.jpg",
                },
                {
                  title: "Understanding Milestone Tracker for Kids",
                  date: "March 10, 2025",
                  description:
                    "A guide to recommended trackers and when parents should calculate it.",
                  img: "https://www.firstthingsfirst.org/wp-content/uploads/2018/11/Child-development.jpg",
                },
                {
                  title: "Developmental Milestones: What to Expect and When",
                  date: "April 2, 2025",
                  description:
                    "A breakdown of key developmental milestones and how to track your child's progress.",
                  img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop",
                },
              ].map((blog, index) => (
                <div key={index} className="blog-item">
                  <img
                    src={blog.img}
                    alt={blog.title}
                    className="blog-item__image"
                  />
                  <div className="blog-item__content">
                    <h3 className="blog-item__title">{blog.title}</h3>
                    <p className="blog-item__date">{blog.date}</p>
                    <p className="blog-item__description">{blog.description}</p>
                    <button
                      className="blog-item__btn"
                      onClick={() => handleLearnMoreClick()}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Parenting Tips Section */}
            <div className="parenting-tips">
              <h2 className="section-title">Parenting Tips</h2>
              {[
                { title: "Healthy Eating Habits", icon: "🍎" },
                { title: "Encouraging Physical Activity", icon: "🏃" },
                { title: "Managing Screen Time", icon: "📱" },
                { title: "Promoting Good Sleep Routines", icon: "🛌" },
              ].map(({ title, icon }) => (
                <div key={title} className="parenting-tips__card">
                  <h3 className="parenting-tips__title">
                    <span className="parenting-tips__icon">{icon}</span> {title}
                  </h3>
                  <p className="parenting-tips__text">
                    Useful strategies to help with {title.toLowerCase()}.
                  </p>
                  <button
                    className="parenting-tips__btn"
                    onClick={handleLearnMoreClick}
                  >
                    Learn More
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="faq-section">
            <h2 className="section-title">Frequently Asked Questions (FAQs)</h2>
            {[
              {
                question: "How often should I track my child's growth?",
                answer:
                  "It's recommended to track your child's height and weight every 1-2 months during early childhood and every 3-6 months as they grow older.",
              },
              {
                question: "What are the key developmental milestones for children?",
                answer:
                  "Milestones include physical (walking, running), cognitive (problem-solving, memory), and social-emotional (interacting with others) aspects.",
              },
              {
                question: "How do I know if my child’s growth is normal?",
                answer:
                  "Compare their growth charts with standard CDC or WHO growth percentiles and consult a pediatrician if you notice any concerns.",
              },
              {
                question:
                  "What can I do if my child is not meeting milestones?",
                answer:
                  "If your child is significantly behind in developmental milestones, consult a doctor for an evaluation and possible early intervention support.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${openFAQ === index ? "faq-item--active" : ""}`}
              >
                <button
                  className="faq-item__question"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}{" "}
                  <span className="faq-item__toggle">
                    {openFAQ === index ? "▲" : "▼"}
                  </span>
                </button>
                <p className="faq-item__answer">{faq.answer}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CDCBody;