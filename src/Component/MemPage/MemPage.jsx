import React from "react";
import Layout4MemP from "../MemPage/Layout4MemP";
import { useNavigate } from "react-router-dom";
import "./MemPage.css";

const MemPage = () => {
  const navigate = useNavigate();
  return (
    <Layout4MemP>
      <div className="bmi-tool-container">
        <div className="bmi-content-wrapper">
          <div className="bmi-section bmi-info">
            <h2>What is BMI?</h2>
            <p>
              BMI (Body Mass Index) is a measure that uses your height and weight
              to work out if your weight is healthy. The BMI calculation divides
              an adult's weight in kilograms by their height in metres squared.
            </p>
          </div>

          <div className="bmi-section bmi-tracking">
            <h2>Tracking BMI</h2>
            <p>
              Tracking BMI over time can help you understand how your child's
              growth compares to other children of the same age and sex. It can
              also help identify potential health risks related to weight.
            </p>
          </div>

          <div className="bmi-section bmi-figures">
            <h2>What Do the Figures Mean?</h2>
            <p>
              - Underweight: BMI is below 18.5.<br />
              - Healthy weight: BMI is between 18.5 and 24.9.<br />
              - Overweight: BMI is between 25 and 29.9.<br />
              - Obese: BMI is 30 or above.
            </p>
          </div>
          
          <div className="bmi-section tool-definition">
            <h2>Tool Definition</h2>
            <p>
              This tool allows users to track and analyze BMI (Body Mass Index) for children.
              It provides insights into whether a child is underweight, has a healthy weight,
              is overweight, or obese based on their height and weight.
            </p>
            <button onClick={() => navigate("/add-child")} className="use-tool-button">
              Use the Tool
            </button>
          </div>
        </div>
      </div>
    </Layout4MemP>
  );
};

export default MemPage;
