import React from "react";
import { useNavigate } from "react-router-dom";
import Layout4MemP from "../MemPage/Layout4MemP";
import "./MemPage.css";

const MemPage = () => {
  const navigate = useNavigate();

  return (
    <Layout4MemP>
      <div className="mempage-wrapper">
        <div className="mempage-content">
          <div className="mempage-content-container">
            {/* Main Content: BMI Section */}
            <div className="mempage-bmi-container">
              <h1 className="mempage-title">Child Health & Growth</h1>
              <div className="mempage-bmi-grid">
                {/* What is BMI? */}
                <div className="mempage-bmi-card mempage-bmi-card-info">
                  <div className="mempage-bmi-image-wrapper">
                    <img
                      src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop"
                      alt="BMI Info"
                      className="mempage-bmi-image"
                    />
                  </div>
                  <h2>What is BMI?</h2>
                  <p>
                    BMI (Body Mass Index) is a measure that uses your height and weight
                    to work out if your weight is healthy. The BMI calculation divides
                    an adult's weight in kilograms by their height in meters squared.
                  </p>
                </div>

                {/* Tracking BMI */}
                <div className="mempage-bmi-card mempage-bmi-card-tracking">
                  <div className="mempage-bmi-image-wrapper">
                    <img
                      src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop"
                      alt="Tracking BMI"
                      className="mempage-bmi-image"
                    />
                  </div>
                  <h2>Tracking BMI</h2>
                  <p>
                    Tracking BMI over time can help you understand how your child's
                    growth compares to other children of the same age and sex. It can
                    also help identify potential health risks related to weight.
                  </p>
                </div>

                {/* What Do the Figures Mean? */}
                <div className="mempage-bmi-card mempage-bmi-card-figures">
                  <div className="mempage-bmi-image-wrapper">
                    <img
                      src="https://www.trs.texas.gov/PublishingImages/Pages/temp/healthcare-news-202311-healthy-weight/weight-management-1.png"
                      alt="BMI Figures"
                      className="mempage-bmi-image"
                    />
                  </div>
                  <h2>What Do the Figures Mean?</h2>
                  <p>
                    - Underweight: BMI below 18.5.<br />
                    - Healthy Weight: BMI 18.5–24.9.<br />
                    - Overweight: BMI 25–29.9.<br />
                    - Obese: BMI 30 or above.
                  </p>
                </div>
              </div>
            </div>

            {/* Membership Benefits Section */}
            <div className="mempage-benefits-container">
              <h2 className="mempage-section-title">Membership Benefits</h2>
              <div className="mempage-benefits-grid">
                <div className="mempage-benefit-card">
                  <span className="mempage-benefit-icon">📈</span>
                  <h3>Personalized Growth Tracking</h3>
                  <p>
                    Monitor your child's growth with tailored insights and recommendations.
                  </p>
                </div>
                <div className="mempage-benefit-card">
                  <span className="mempage-benefit-icon">👩‍⚕️</span>
                  <h3>Expert Consultations</h3>
                  <p>
                    Access to pediatricians for one-on-one advice and support.
                  </p>
                </div>
                <div className="mempage-benefit-card">
                  <span className="mempage-benefit-icon">📚</span>
                  <h3>Educational Resources</h3>
                  <p>
                    Gain access to articles, videos, and guides on child health.
                  </p>
                </div>
              </div>
            </div>

            {/* Health Tips Section */}
            <div className="mempage-health-tips-container">
              <h2 className="mempage-section-title">Health Tips for Children</h2>
              <div className="mempage-health-tips-grid">
                <div className="mempage-health-tip-card">
                  <div className="mempage-health-tip-image-wrapper">
                    <img
                      src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1f?q=80&w=800&auto=format&fit=crop"
                      alt="Nutrition"
                      className="mempage-health-tip-image"
                    />
                  </div>
                  <h3>Balanced Nutrition</h3>
                  <p>
                    Ensure your child gets a variety of fruits, vegetables, and proteins daily.
                  </p>
                </div>
                <div className="mempage-health-tip-card">
                  <div className="mempage-health-tip-image-wrapper">
                    <img
                      src="https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=800&auto=format&fit=crop"
                      alt="Physical Activity"
                      className="mempage-health-tip-image"
                    />
                  </div>
                  <h3>Stay Active</h3>
                  <p>
                    Encourage at least 60 minutes of physical activity each day.
                  </p>
                </div>
                <div className="mempage-health-tip-card">
                  <div className="mempage-health-tip-image-wrapper">
                    <img
                      src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop"
                      alt="Sleep Well"
                      className="mempage-health-tip-image"
                    />
                  </div>
                  <h3>Sleep Well</h3>
                  <p>
                    Ensure your child gets 9-11 hours of sleep per night for optimal growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Growth Milestones Section */}
            <div className="mempage-milestones-container">
              <h2 className="mempage-section-title">Growth Milestones</h2>
              <div className="mempage-milestones-grid">
                <div className="mempage-milestone-card">
                  <h3>0-2 Years</h3>
                  <p>
                    Rapid growth, first steps, and speech development.
                  </p>
                </div>
                <div className="mempage-milestone-card">
                  <h3>3-5 Years</h3>
                  <p>
                    Improved coordination, social skills, and basic learning.
                  </p>
                </div>
                <div className="mempage-milestone-card">
                  <h3>6-12 Years</h3>
                  <p>
                    Steady growth, cognitive development, and independence.
                  </p>
                </div>
              </div>
            </div>

            {/* Community Support Section */}
            <div className="mempage-community-container">
              <h2 className="mempage-section-title">Community Support</h2>
              <div className="mempage-community-content">
                <div className="mempage-community-text">
                  <p>
                    Join our community of parents to share experiences, ask questions, and get support. Connect with others who understand the journey of raising healthy children.
                  </p>
                  <button
                    className="mempage-community-button"
                    onClick={() => navigate("/community")}
                  >
                    Join the Community
                  </button>
                </div>
                <div className="mempage-community-image-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop"
                    alt="Community"
                    className="mempage-community-image"
                  />
                </div>
              </div>
            </div>

            {/* Upcoming Events Section */}
            <div className="mempage-events-container">
              <h2 className="mempage-section-title">Upcoming Events</h2>
              <div className="mempage-events-grid">
                <div className="mempage-event-card">
                  <h3>Webinar: Nutrition for Kids</h3>
                  <p>Date: April 10, 2025</p>
                  <p>Join us to learn about healthy eating habits for children.</p>
                  <button
                    className="mempage-event-button"
                    onClick={() => navigate("/events/nutrition-webinar")}
                  >
                    Register Now
                  </button>
                </div>
                <div className="mempage-event-card">
                  <h3>Parenting Workshop</h3>
                  <p>Date: April 15, 2025</p>
                  <p>A workshop on effective parenting strategies.</p>
                  <button
                    className="mempage-event-button"
                    onClick={() => navigate("/events/parenting-workshop")}
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout4MemP>
  );
};

export default MemPage;