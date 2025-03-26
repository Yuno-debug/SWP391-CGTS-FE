import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateGrowthMetrics.css";
import NavBar from "../HomePage/NavBar/NavBar";
import Footer from "../HomePage/Footer/Footer";
import GrowthChart from "../MemPage/GrowthChart";

const UpdateGrowthMetrics = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [growthRecords, setGrowthRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [growthData, setGrowthData] = useState({
    recordId: "",
    weight: "",
    height: "",
    headCircumference: "",
    upperArmCircumference: "",
    month: "",
    notes: "",
    recordedByUser: "",
    old: "",
  });
  const [childBirthDate, setChildBirthDate] = useState(null);

  useEffect(() => {
    if (!childId) {
      console.error("❌ Error: childId is undefined or invalid");
      return;
    }

    const fetchChildInfo = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("❌ Error: userId is missing from localStorage");
          setErrorMessage("User ID not found. Please log in again.");
          return;
        }

        const response = await axios.get(
          `http://localhost:5200/api/Child/${childId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data?.data) {
          const child = response.data.data;
          if (child && child.dateOfBirth) {
            setChildBirthDate(new Date(child.dateOfBirth));
          } else {
            console.error("❌ Birth date missing from API response:", response.data);
            setErrorMessage("Child birth date is missing. Cannot proceed.");
          }
        } else {
          console.error("❌ Unexpected response format:", response.data);
          setErrorMessage("Unexpected response format. Please try again later.");
        }
      } catch (error) {
        console.error("❌ Error fetching child info:", error);
        setErrorMessage("Error fetching child info. Please try again later.");
      }
    };

    fetchChildInfo();
  }, [childId]);

  useEffect(() => {
    const fetchGrowthRecords = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5200/api/growth-records/child/${childId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data?.$values && Array.isArray(response.data.$values)) {
          const sortedRecords = response.data.$values.sort((a, b) => a.month - b.month);
          setGrowthRecords(sortedRecords);
        } else {
          console.error("❌ Unexpected response format:", response.data);
          setErrorMessage("Unexpected response format. Please try again later.");
        }
      } catch (error) {
        console.error("❌ Error fetching growth records:", error);
        setErrorMessage("Error fetching growth records. Please try again later.");
      }
    };
    fetchGrowthRecords();
  }, [childId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGrowthData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectRecord = (record) => {
    setGrowthData({ ...record });
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const WHO_BMI_TABLE = [
    { age: 0, min: 13, max: 17 },
    { age: 1, min: 14, max: 18 },
    { age: 2, min: 14.5, max: 18.5 },
    { age: 3, min: 14.8, max: 19 },
    { age: 4, min: 15, max: 19.5 },
    { age: 5, min: 15.2, max: 20 },
    { age: 6, min: 15.3, max: 20.5 },
    { age: 7, min: 15.4, max: 21 },
    { age: 8, min: 15.5, max: 21.5 },
    { age: 9, min: 15.7, max: 22 },
    { age: 10, min: 16, max: 23 },
    { age: 11, min: 16.5, max: 24 },
    { age: 12, min: 17, max: 24.5 },
    { age: 13, min: 17.5, max: 25 },
    { age: 14, min: 18, max: 25.5 },
    { age: 15, min: 18.5, max: 26 },
    { age: 16, min: 19, max: 26.5 },
    { age: 17, min: 19.5, max: 27 },
    { age: 18, min: 20, max: 27.5 },
    { age: 19, min: 20.5, max: 28 },
  ];

  const getWHOClassification = (bmi, age) => {
    if (!bmi || age < 0 || age > 19) return "Unknown";

    const category = WHO_BMI_TABLE.find((entry) => entry.age === age);
    if (!category) return "Unknown";

    if (bmi < category.min) return "Underweight";
    if (bmi > category.max) return "Overweight";
    return "Normal";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Submitting Growth Data:", JSON.stringify(growthData, null, 2));

    if (!growthData.month) {
      setErrorMessage("Please enter a valid month (1-12).");
      return;
    }

    if (!childBirthDate) {
      setErrorMessage("Child birth date is missing. Cannot proceed.");
      return;
    }

    const birthDate = new Date(childBirthDate);
    birthDate.setMonth(parseInt(growthData.month, 10) - 1);
    const formattedMonth = Number(growthData.month);

    const requestData = {
      ...growthData,
      month: formattedMonth,
      childId: parseInt(childId, 10),
      old: parseInt(growthData.old, 10),
    };

    try {
      let response;
      if (growthData.recordId) {
        response = await axios.put(
          `http://localhost:5200/api/growth-records/update/${growthData.recordId}`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5200/api/growth-records/create",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      setGrowthRecords((prevRecords) => {
        if (growthData.recordId) {
          return [...prevRecords.map((record) =>
            record.recordId === growthData.recordId ? response.data : record
          )].sort((a, b) => a.month - b.month);
        } else {
          return [...prevRecords, response.data].sort((a, b) => a.month - b.month);
        }
      });

      setGrowthData({
        recordId: "",
        weight: "",
        height: "",
        headCircumference: "",
        upperArmCircumference: "",
        month: "",
        notes: "",
        recordedByUser: "",
        old: "",
      });
    } catch (error) {
      console.error("❌ Error:", error.response ? error.response.data : error.message);
      setErrorMessage("Failed to submit data. Please check your input and try again.");
    }
  };

  const handleDeleteRecord = async (recordId) => {
    try {
      const response = await fetch(`/api/growth-records/delete/${recordId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      console.log(`Record ${recordId} deleted successfully!`);
      setGrowthRecords((prevRecords) => prevRecords.filter(record => record.recordId !== recordId));
    } catch (error) {
      console.error("Error deleting record:", error);
      setErrorMessage("Failed to delete record. Please try again.");
    }
  };

  // Prepare chart data with proper date formatting
  const chartData = growthRecords.map(record => {
    if (!childBirthDate) return { ...record, dateLabel: `Month ${record.month}` };
    const date = new Date(childBirthDate.getFullYear(), record.month - 1, 1);
    return {
      ...record,
      date: date.getTime(),
      dateLabel: date.toLocaleDateString("vi-VN", { month: "short", year: "2-digit" }),
    };
  });

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Handle smooth scrolling to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <NavBar />
      <div className="update-growth-metrics-wrapper">
        <div className="update-growth-metrics-container">
          <div className="header-section" id="update-form-section">
            <button onClick={handleBack} className="back-button">
              Back
            </button>
            <h2>Update Growth Metrics</h2>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form onSubmit={handleSubmit} className="update-growth-metrics-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Month (1-12):</label>
                <input
                  type="number"
                  name="month"
                  value={growthData.month}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  required
                />
              </div>
              <div className="form-group">
                <label>Age (years):</label>
                <input
                  type="number"
                  name="old"
                  value={growthData.old}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Weight (kg):</label>
                <input
                  type="number"
                  name="weight"
                  value={growthData.weight}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Height (cm):</label>
                <input
                  type="number"
                  name="height"
                  value={growthData.height}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Head Circumference (cm):</label>
                <input
                  type="number"
                  name="headCircumference"
                  value={growthData.headCircumference}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Upper Arm Circumference (cm):</label>
                <input
                  type="number"
                  name="upperArmCircumference"
                  value={growthData.upperArmCircumference}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Recorded By:</label>
                <input
                  type="text"
                  name="recordedByUser"
                  value={growthData.recordedByUser}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Notes:</label>
              <textarea
                name="notes"
                value={growthData.notes}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <button type="submit" className="update-growth-metrics-button">
              {growthData.recordId ? "Update" : "Create"}
            </button>
          </form>

          <div className="growth-records-list">
            <h3 id="growth-records-section">Growth Records Information</h3>
            <table className="records-table">
              <thead>
                <tr>
                  <th>Age</th>
                  <th>Month</th>
                  <th>Weight</th>
                  <th>Height</th>
                  <th>BMI</th>
                  <th>WHO Classification</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {growthRecords.map((record) => {
                  const bmi = calculateBMI(record.weight, record.height);
                  return (
                    <tr key={record.recordId}>
                      <td>{record.old}</td>
                      <td>
                        {childBirthDate
                          ? new Date(childBirthDate.getFullYear(), record.month - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
                          : `Month ${record.month}`}
                      </td>
                      <td>{record.weight}</td>
                      <td>{record.height}</td>
                      <td>{bmi}</td>
                      <td>{getWHOClassification(bmi, record.old)}</td>
                      <td>
                        <button onClick={() => handleDeleteRecord(record.recordId)} className="delete-button">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div id="growth-chart-section">
              <GrowthChart chartData={chartData} />
            </div>
            <div className="who-bmi-table-container" id="who-bmi-section">
              <h3>WHO BMI-for-Age Classification (0-19 years)</h3>
              <table className="who-bmi-table">
                <thead>
                  <tr>
                    <th>Age (years)</th>
                  <th>Underweight (&lt; Min BMI)</th>
                  <th>Normal (Min - Max BMI)</th>
                  <th>Overweight (&gt; Max BMI)</th>
                  </tr>
                </thead>
                <tbody>
                  {WHO_BMI_TABLE.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.age}</td>
                      <td>&lt; {entry.min}</td>
                      <td>{entry.min} - {entry.max}</td>
                      <td>&gt; {entry.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Table of Contents Sidebar */}
        <div className="toc-sidebar">
          <h4>Table of Contents</h4>
          <ul>
            <li>
              <button onClick={() => scrollToSection("update-form-section")} className="toc-link">
                Update Form
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("growth-records-section")} className="toc-link">
                Growth Records
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("growth-chart-section")} className="toc-link">
                Growth Chart
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("who-bmi-section")} className="toc-link">
                WHO Classification
              </button>
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateGrowthMetrics;