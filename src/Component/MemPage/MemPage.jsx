import React, { useState } from "react";
import Layout4MemP from "../MemPage/Layout4MemP";
import "./MemPage.css"; // Ensure you import the CSS file

const MemPage = () => {
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childHeight, setChildHeight] = useState("");
  const [childWeight, setChildWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [bmiStatus, setBmiStatus] = useState("");
  const [profiles, setProfiles] = useState([]);

  const handleAddChild = (e) => {
    e.preventDefault();
    const newProfile = {
      name: childName,
      age: childAge,
      height: childHeight,
      weight: childWeight,
      bmi: calculateBmi(childHeight, childWeight),
    };
    setProfiles([...profiles, newProfile]);
    setChildName("");
    setChildAge("");
    setChildHeight("");
    setChildWeight("");
    setBmi(null);
    setBmiStatus("");
  };

  const calculateBmi = (height, weight) => {
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    const bmiFixed = bmiValue.toFixed(2);
    setBmi(bmiFixed);
    setBmiStatus(getBmiStatus(bmiFixed));
    return bmiFixed;
  };

  const getBmiStatus = (bmi) => {
    if (bmi < 18.5) {
      return "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return "Healthy weight";
    } else if (bmi >= 25 && bmi < 29.9) {
      return "Overweight";
    } else {
      return "Obese";
    }
  };

  return (
    <Layout4MemP>
      <div className="mem-page">
        <div className="content-wrapper">
          <div className="bmi-info-section">
            <h2>What is BMI?</h2>
            <p>
              BMI (Body Mass Index) is a measure that uses your height and weight
              to work out if your weight is healthy. The BMI calculation divides
              an adult's weight in kilograms by their height in metres squared.
            </p>
          </div>

          <div className="bmi-tracking-section">
            <h2>Tracking BMI</h2>
            <p>
              Tracking BMI over time can help you understand how your child's
              growth compares to other children of the same age and sex. It can
              also help identify potential health risks related to weight.
            </p>
          </div>

          <div className="bmi-figures-section">
            <h2>What Do the Figures Mean?</h2>
            <p>
              - Underweight: BMI is below 18.5.
              <br />
              - Healthy weight: BMI is between 18.5 and 24.9.
              <br />
              - Overweight: BMI is between 25 and 29.9.
              <br />
              - Obese: BMI is 30 or above.
            </p>
          </div>

          <div className="add-child-section">
            <h2>Add Child</h2>
            <form onSubmit={handleAddChild}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Height (cm):</label>
                <input
                  type="number"
                  value={childHeight}
                  onChange={(e) => setChildHeight(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Weight (kg):</label>
                <input
                  type="number"
                  value={childWeight}
                  onChange={(e) => setChildWeight(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Add Child</button>
            </form>
          </div>

          <div className="bmi-section">
            <h2>Calculate BMI</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                calculateBmi(childHeight, childWeight);
              }}
            >
              <div className="form-group">
                <label>Height (cm):</label>
                <input
                  type="number"
                  value={childHeight}
                  onChange={(e) => setChildHeight(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Weight (kg):</label>
                <input
                  type="number"
                  value={childWeight}
                  onChange={(e) => setChildWeight(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Calculate BMI</button>
            </form>
            {bmi && (
              <div className="bmi-result">
                <h3>BMI: {bmi}</h3>
                <div className="bmi-status">
                  <div className={`bmi-bar ${bmiStatus.toLowerCase().replace(" ", "-")}`}>
                    <span>{bmiStatus}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profiles-section">
            <h2>Child Profiles</h2>
            <ul>
              {profiles.map((profile, index) => (
                <li key={index} className="profile-item">
                  <p>Name: {profile.name}</p>
                  <p>Age: {profile.age}</p>
                  <p>Height: {profile.height} cm</p>
                  <p>Weight: {profile.weight} kg</p>
                  <p>BMI: {profile.bmi}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout4MemP>
  );
};

export default MemPage;
