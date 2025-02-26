import React from 'react';
import './About.css';
import LayoutForAb from './LayoutForAb.jsx';
import growthChartImage from '../../assets/growth-chart.jpg';
import milestonesImage from '../../assets/milestones.png';
import nutritionImage from '../../assets/nutrition.jpg';
import checkupImage from '../../assets/checkup.jpg';
import expertArticlesImage from '../../assets/expert-articles.jpg';

const About = () => {
  return (
    <LayoutForAb>
      <div className="about-container">
        <h1 className="about-title">About Us</h1>
        <p className="about-description">
          Welcome to our Child Growth Tracking platform. Our mission is to provide parents and caregivers with the tools and resources they need to monitor and support their child's growth and development.
        </p>
        <h2 className="about-subtitle">Our Mission</h2>
        <p className="about-text">
          We believe that every child deserves the best start in life. Our platform offers comprehensive tracking tools, expert advice, and personalized insights to help you ensure your child is growing and developing healthily.
        </p>
        <h2 className="about-subtitle">What We Offer</h2>
        <ul className="about-list">
          <li>
            <img src={growthChartImage} alt="Growth Charts" className="about-image" />
            Growth Charts: Track your child's height, weight, and head circumference over time.
          </li>
          <li>
            <img src={milestonesImage} alt="Developmental Milestones" className="about-image" />
            Developmental Milestones: Monitor key milestones and ensure your child is on track.
          </li>
          <li>
            <img src={nutritionImage} alt="Nutrition Guidance" className="about-image" />
            Nutrition Guidance: Get tips and advice on providing a balanced diet for your child.
          </li>
          <li>
            <img src={checkupImage} alt="Health Checkup Reminders" className="about-image" />
            Health Checkup Reminders: Stay on top of regular health checkups and vaccinations.
          </li>
          <li>
            <img src={expertArticlesImage} alt="Expert Articles" className="about-image" />
            Expert Articles: Access a library of articles written by pediatricians and child development experts.
          </li>
        </ul>
        <h2 className="about-subtitle">Our Team</h2>
        <p className="about-text">
          Our team is made up of dedicated professionals with a passion for child health and development. From pediatricians to nutritionists, we work together to bring you the most accurate and up-to-date information.
        </p>
        <h2 className="about-subtitle">Contact Us</h2>
        <p className="about-text">
          If you have any questions or need support, please don't hesitate to reach out to us. We're here to help you every step of the way.
        </p>
      </div>
    </LayoutForAb>
  );
};

export default About;