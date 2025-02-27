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
          Welcome to our Child Growth Tracking platform. Our mission is to provide parents and caregivers with the best tools to monitor and support their child's development.
        </p>

        {/* Our Mission */}
        <h2 className="about-subtitle">Our Mission</h2>
        <p className="about-text">
          We believe that every child deserves the best start in life. Our platform offers comprehensive tracking tools, expert advice, and personalized insights to help you ensure your child is growing healthily.
        </p>

        {/* Core Values */}
        <h2 className="about-subtitle">Our Core Values</h2>
        <ul className="about-values">
          <li>📈 Accuracy – Providing precise and reliable growth data.</li>
          <li>👨‍👩‍👧‍👦 Community – Supporting parents with shared knowledge.</li>
          <li>🧠 Knowledge – Backed by pediatricians and child experts.</li>
          <li>💙 Care – Prioritizing children's well-being.</li>
        </ul>

        {/* What We Offer */}
        <h2 className="about-subtitle">What We Offer</h2>
        <ul className="about-list">
          <li>
            <img src={growthChartImage} alt="Growth Charts" className="about-image" />
            <span>Growth Charts: Track your child's height, weight, and head circumference over time.</span>
          </li>
          <li>
            <img src={milestonesImage} alt="Developmental Milestones" className="about-image" />
            <span>Developmental Milestones: Monitor key milestones and ensure your child is on track.</span>
          </li>
          <li>
            <img src={nutritionImage} alt="Nutrition Guidance" className="about-image" />
            <span>Nutrition Guidance: Get tips and advice on providing a balanced diet for your child.</span>
          </li>
          <li>
            <img src={checkupImage} alt="Health Checkup Reminders" className="about-image" />
            <span>Health Checkup Reminders: Stay on top of regular health checkups and vaccinations.</span>
          </li>
          <li>
            <img src={expertArticlesImage} alt="Expert Articles" className="about-image" />
            <span>Expert Articles: Access a library of articles written by pediatricians and child development experts.</span>
          </li>
        </ul>

        {/* How It Works */}
        <h2 className="about-subtitle">How It Works</h2>
        <p className="about-text">
          1️⃣ **Sign Up** – Create an account and add your child's details. <br />
          2️⃣ **Start Tracking** – Record height, weight, and other key metrics. <br />
          3️⃣ **Get Insights** – Receive personalized tips and guidance. <br />
          4️⃣ **Connect with Experts** – Read expert articles or consult with professionals.
        </p>

        {/* Parent Testimonials */}
        <h2 className="about-subtitle">What Parents Say</h2>
        <div className="testimonial">
          <p className="testimonial-text">
            "This platform has been a lifesaver! I can easily track my baby's milestones and get insights on their growth."
          </p>
          <span className="testimonial-author">– Emily R., Proud Mom</span>
        </div>

        {/* Join Our Community */}
        <h2 className="about-subtitle">Join Our Community</h2>
        <p className="about-text">
          Join thousands of parents who are actively tracking their child's growth. Together, we ensure a healthier future for our little ones!
        </p>
      </div>
    </LayoutForAb>
  );
};

export default About;
