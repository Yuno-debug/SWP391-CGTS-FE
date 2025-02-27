import React, { useState } from 'react';
import './AddChild.css';
import Layout4MemP from './Layout4MemP';

const AddChild = () => {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childHeight, setChildHeight] = useState('');
  const [childWeight, setChildWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [bmiStatus, setBmiStatus] = useState('');
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
    clearForm();
  };

  const calculateBmi = (height, weight) => {
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(bmiValue);
    setBmiStatus(getBmiStatus(bmiValue));
    return bmiValue;
  };

  const getBmiStatus = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 24.9) return 'Normal weight';
    if (bmi >= 25 && bmi < 29.9) return 'Overweight';
    return 'Obesity';
  };

  const clearForm = () => {
    setChildName('');
    setChildAge('');
    setChildHeight('');
    setChildWeight('');
  };

  return (
<Layout4MemP>
    <div className="add-child-container">
      <div className="add-child-content">
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
            <button type="submit" className="add-child-button">Add Child</button>
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
            <button type="submit" className="calculate-bmi-button">Calculate BMI</button>
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

export default AddChild;