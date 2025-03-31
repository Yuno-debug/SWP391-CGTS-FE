import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateGrowthMetrics.css"; // Ensure CSS is imported
import NavBar from "../HomePage/NavBar/NavBar";
import Footer from "../HomePage/Footer/Footer";
import GrowthChart from "../MemPage/GrowthChart"; // Assuming this path is correct

const UpdateGrowthMetrics = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [growthRecords, setGrowthRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [childBirthDate, setChildBirthDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [growthData, setGrowthData] = useState({
    weight: "",
    height: "",
    headCircumference: "",
    upperArmCircumference: "",
    month: "",
    notes: "",
    recordedByUser: "",
    old: "", // Age in years
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch Child Info to get Birth Date (for chart labels)
  useEffect(() => {
    if (!childId) {
      console.error("❌ Error: childId is undefined or invalid");
      setErrorMessage("Child ID is missing. Cannot load data.");
      return;
    }

    const fetchChildInfo = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // Assuming userId might be needed, though not used in API call

      if (!token) {
        setErrorMessage("Authentication token not found. Please log in again.");
        return;
      }
      if (!userId) {
        // Optional: Add check if userId is strictly required for context, though not for API
        // setErrorMessage("User ID not found. Please log in again.");
        // return;
      }


      try {
        const response = await axios.get(
          `http://localhost:5200/api/Child/${childId}`, // Ensure this endpoint is correct
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Adjust according to your actual API response structure
        if (response.data?.data?.dateOfBirth) {
          setChildBirthDate(new Date(response.data.data.dateOfBirth));
        } else {
          console.warn("⚠️ Child date of birth not found in response.");
        }
      } catch (error) {
        console.error("❌ Error fetching child info:", error.response?.data || error.message);
        setErrorMessage(
          `Error fetching child info: ${error.response?.data?.message || error.message}. Please check the console.`
        );
      }
    };

    fetchChildInfo();
  }, [childId]); // Dependency array includes childId

  // Fetch Growth Records for the specific child
  useEffect(() => {
    if (!childId) return; // Don't fetch if childId is missing

    const fetchGrowthRecords = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Authentication token not found. Please log in again.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5200/api/growth-records/child/${childId}`, // Ensure this endpoint is correct
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check the actual structure of your API response
        // Assuming the data is in response.data or response.data.$values
        let records = response.data?.$values || response.data;

        if (records && Array.isArray(records)) {
          // Sort records by age ('old') and then by month if ages are the same
          const sortedRecords = records.sort((a, b) => {
             if (a.old !== b.old) {
               return a.old - b.old; // Sort by age first
             }
             return a.month - b.month; // Then sort by month
          });
          setGrowthRecords(sortedRecords);
        } else {
          console.warn("⚠️ Growth records data is not an array or is missing:", response.data);
          setGrowthRecords([]); // Set to empty array if data is invalid
        }
      } catch (error) {
        console.error("❌ Error fetching growth records:", error.response?.data || error.message);
        setErrorMessage(
          `Error fetching growth records: ${error.response?.data?.message || error.message}. Please check the console.`
        );
      }
    };

    fetchGrowthRecords();
  }, [childId]); // Dependency array includes childId

  // Handle input changes in the modal form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGrowthData((prevData) => ({ ...prevData, [name]: value }));
    // Clear the specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    if (!weight || !height || height <= 0) return null; // Added check for height <= 0
    const heightInMeters = height / 100;
    // BMI = weight (kg) / [height (m)]^2
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  // WHO BMI-for-age data (Simplified - Use official WHO data/library for accuracy)
  const WHO_BMI_TABLE = [
    // Note: This is a simplified representation. Official WHO charts use percentiles (SD scores).
    // Use this for demonstration; consult official resources for clinical use.
    { age: 0, min: 11, max: 15 }, // Example ranges, adjust based on WHO standards
    { age: 1, min: 13, max: 17 },
    { age: 2, min: 14, max: 18 },
    { age: 3, min: 13.8, max: 17.8 },
    { age: 4, min: 13.6, max: 17.6 },
    { age: 5, min: 13.4, max: 17.4 },
    // ... add ranges for ages 6-19 based on WHO data
    // Example for older ages:
    { age: 10, min: 14.4, max: 20 },
    { age: 15, min: 16.5, max: 23 },
    { age: 19, min: 18.5, max: 25 }, // Adults start around 18.5
  ];

  // Get WHO classification based on calculated BMI and age
  const getWHOClassification = (bmi, ageInYears) => {
    // Ensure age is an integer for comparison
    const age = Math.floor(ageInYears);

    if (!bmi || age < 0 || age > 19) return "N/A"; // Not Applicable or Unknown

    // Find the closest age category if exact match isn't found (simple approach)
    const category = WHO_BMI_TABLE.find((entry) => entry.age === age);

    if (!category) {
      // Handle ages not exactly listed (e.g., find nearest or return N/A)
      // For simplicity, returning N/A if age isn't in the simplified table
      return "N/A (Age not in table)";
    }

    // Classify based on the found category ranges
    if (bmi < category.min) return "Underweight";
    if (bmi > category.max) return "Overweight"; // Note: WHO also has "Obese" category
    return "Normal";
  };

  // Prepare data for the GrowthChart component
  const chartData = growthRecords.map((record) => {
    const baseData = {
      month: record.month,
      age: record.old, // Use 'old' for age
      weight: record.weight,
      height: record.height,
      headCircumference: record.headCircumference, // Include other metrics if chart uses them
      upperArmCircumference: record.upperArmCircumference,
    };

    // Create a date label if birth date is available
    if (childBirthDate) {
      // Estimate the date based on age in years and month
      // This is an approximation, might not be perfectly accurate
      const recordYear = childBirthDate.getFullYear() + Math.floor(record.old);
      // Month is 1-based in record, 0-based in Date object
      const recordDate = new Date(recordYear, record.month - 1, 15); // Use mid-month approx.

      return {
        ...baseData,
        date: recordDate.getTime(), // Timestamp for chart sorting/axis
        dateLabel: recordDate.toLocaleDateString("vi-VN", { month: "short", year: "numeric" }),
      };
    } else {
      // Fallback label if no birth date
      return {
        ...baseData,
        dateLabel: `Age ${record.old}, Month ${record.month}`
      }
    }
  });

  // Navigate back to the previous page
  const handleBack = () => navigate(-1);

  // Scroll to a specific section on the page
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Validate the modal form data before submission
  const validateForm = () => {
    let tempErrors = {};
    const currentYear = new Date().getFullYear();
    const birthYear = childBirthDate ? childBirthDate.getFullYear() : currentYear; // Estimate birth year if needed
    const ageValue = parseInt(growthData.old);
    const monthValue = parseInt(growthData.month);

    if (!growthData.month) tempErrors.month = "Month is required";
    else if (isNaN(monthValue) || monthValue < 1 || monthValue > 12) {
      tempErrors.month = "Month must be between 1 and 12";
    }

    if (!growthData.old) tempErrors.old = "Age (years) is required";
    else if (isNaN(ageValue) || ageValue < 0 || ageValue > 19) { // Assuming max age 19
      tempErrors.old = "Age must be between 0 and 19";
    } else if (childBirthDate && (birthYear + ageValue > currentYear)) {
        // Basic check: entered age shouldn't result in a future year
        // tempErrors.old = "Calculated year seems to be in the future based on birth date.";
        // This check might be too strict or complex, consider removing if causing issues
    }

    // Validate numeric fields: required and positive
    const numericFields = ['weight', 'height', 'headCircumference', 'upperArmCircumference'];
    numericFields.forEach(field => {
      const value = growthData[field];
      const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); // Format label
      if (!value) {
        tempErrors[field] = `${label} is required`;
      } else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
        tempErrors[field] = `${label} must be a positive number`;
      }
    });

    if (!growthData.recordedByUser.trim()) {
      tempErrors.recordedByUser = "Recorded By is required";
    } else if (growthData.recordedByUser.trim().length < 2) {
      tempErrors.recordedByUser = "Recorded By must be at least 2 characters";
    }

    setFormErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Return true if no errors
  };

  // Handle form submission (Add New Record)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) {
      console.log("Validation failed:", formErrors);
      return; // Stop submission if validation fails
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const newRecordPayload = {
        childId: childId,
        month: parseInt(growthData.month),
        old: parseInt(growthData.old), // Age in years
        weight: parseFloat(growthData.weight),
        height: parseFloat(growthData.height),
        headCircumference: parseFloat(growthData.headCircumference),
        upperArmCircumference: parseFloat(growthData.upperArmCircumference),
        recordedByUser: growthData.recordedByUser.trim(),
        notes: growthData.notes.trim(),
        // Ensure payload matches the backend API expectations
      };

      const response = await axios.post(
        `http://localhost:5200/api/growth-records/create`, // Ensure this is your create endpoint
        newRecordPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' // Explicitly set content type
          },
        }
      );

      // Assuming the backend returns the newly created record
      const createdRecord = response.data; // Adjust if response structure is different

      if (createdRecord) {
          // Add the new record to the state and re-sort
          setGrowthRecords((prevRecords) => {
            const updatedRecords = [...prevRecords, createdRecord].sort((a, b) => {
               if (a.old !== b.old) return a.old - b.old;
               return a.month - b.month;
            });
            return updatedRecords;
          });

          // Reset form, close modal, clear errors
          setGrowthData({
            weight: "", height: "", headCircumference: "", upperArmCircumference: "",
            month: "", notes: "", recordedByUser: "", old: "",
          });
          setFormErrors({});
          setIsModalOpen(false);
          setErrorMessage(""); // Clear any previous errors
      } else {
         console.error("❌ Error: No data returned after creating record.");
         setErrorMessage("Failed to add record: Invalid response from server.");
      }

    } catch (error) {
      console.error("❌ Error adding growth record:", error.response?.data || error.message);
      // Display a more specific error message if available from the backend
      const backendMessage = error.response?.data?.message || error.response?.data?.title;
      setErrorMessage(
        `Failed to add growth record: ${backendMessage || error.message}. Check console for details.`
      );
    }
  };

  // Effect to handle body scroll lock when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);


  return (
    <>
      <NavBar />
      <div className="update-growth-metrics-wrapper">
        {/* Main Content Area */}
        <div className="update-growth-metrics-container">
          {/* Header with Title and Buttons */}
          <div className="header-section" id="growth-records-section"> {/* Added ID for TOC */}
            <button onClick={handleBack} className="back-button">Back</button>
            <h2>Growth Metrics</h2>
            <button onClick={() => setIsModalOpen(true)} className="add-record-button">
              <span className="plus-icon">+</span> Add Record
            </button>
          </div>

          {/* Display General Error Messages */}
          {errorMessage && !isModalOpen && <p className="error-message">{errorMessage}</p>}

          {/* ----- Conditionally render Growth Records & Charts ----- */}
          {/* This section is hidden when the modal is open */}
          {!isModalOpen && (
            <div className="growth-records-list">
              <h3>Growth Records Information</h3>
              {growthRecords.length > 0 ? (
                <table className="growth-records-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Age (Yrs)</th>
                      <th>Month</th>
                      <th>Weight (kg)</th>
                      <th>Height (cm)</th>
                      <th>BMI</th>
                      <th>WHO Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {growthRecords.map((record, index) => {
                      const bmi = calculateBMI(record.weight, record.height);
                      // Ensure record.old is treated as a number for classification
                      const ageForClassification = typeof record.old === 'number' ? record.old : parseInt(record.old);
                      return (
                        // Use a unique ID from the record if available, otherwise index
                        <tr key={record.recordId || record.id || index}>
                          <td>{index + 1}</td>
                          <td>{record.old}</td>
                          <td>{record.month}</td>
                          <td>{record.weight}</td>
                          <td>{record.height}</td>
                          <td>{bmi ?? 'N/A'}</td> {/* Show N/A if BMI is null */}
                          <td>{getWHOClassification(bmi, ageForClassification)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                // Show message if no records are available (and not loading/error)
                !errorMessage && <p style={{ textAlign: 'center', margin: '20px 0' }}>No growth records found for this child yet.</p>
              )}

              {/* Growth Chart Section */}
              {growthRecords.length > 0 && (
                <div id="growth-chart-section">
                   {/* Optional: Add title for the chart section */}
                   {/* <h4>Growth Trends</h4> */}
                  <GrowthChart chartData={chartData} />
                </div>
              )}

              {/* WHO BMI Reference Table Section */}
              <div className="who-bmi-table-container" id="who-bmi-section"> {/* Added ID for TOC */}
                <h3>WHO BMI-for-Age Reference (Simplified)</h3>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                  Note: These are simplified ranges for demonstration. Consult official WHO growth standards for clinical assessment.
                </p>
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
          )}
        </div>

        {/* Table of Contents Sidebar */}
        <div className="toc-sidebar">
          <h4>Table of Contents</h4>
          <ul>
            <li>
              <button
                onClick={() => scrollToSection("growth-records-section")}
                className="toc-link"
              >
                Growth Records
              </button>
            </li>
            {/* Conditionally show chart link if there's data */}
            {growthRecords.length > 0 && (
              <li>
                <button
                  onClick={() => scrollToSection("growth-chart-section")}
                  className="toc-link"
                >
                  Growth Chart
                </button>
              </li>
            )}
            <li>
              <button
                onClick={() => scrollToSection("who-bmi-section")}
                className="toc-link"
              >
                WHO Reference
              </button>
            </li>
          </ul>
        </div>

      </div> {/* End Wrapper */}

      {/* Modal for Adding New Record */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}> {/* Close on overlay click */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside */}
            <h3>Add New Growth Record</h3>
            {/* Display Submit Errors Inside Modal */}
             {errorMessage && <p className="error-message" style={{marginBottom: '15px'}}>{errorMessage}</p>}
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-container">
                {/* Form Fields */}
                <div className="form-group">
                  <label htmlFor="month">Month (1-12):</label>
                  <input id="month" type="number" name="month" value={growthData.month} onChange={handleChange} min="1" max="12" placeholder="Enter month (1-12)" />
                  {formErrors.month && <span className="form-error">{formErrors.month}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="old">Age (years):</label>
                  <input id="old" type="number" name="old" value={growthData.old} onChange={handleChange} min="0" max="19" placeholder="Enter age in years (0-19)" />
                  {formErrors.old && <span className="form-error">{formErrors.old}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="weight">Weight (kg):</label>
                  <input id="weight" type="number" name="weight" value={growthData.weight} onChange={handleChange} step="0.01" placeholder="e.g., 10.5" />
                  {formErrors.weight && <span className="form-error">{formErrors.weight}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="height">Height (cm):</label>
                  <input id="height" type="number" name="height" value={growthData.height} onChange={handleChange} step="0.1" placeholder="e.g., 75.5" />
                  {formErrors.height && <span className="form-error">{formErrors.height}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="headCircumference">Head Circumference (cm):</label>
                  <input id="headCircumference" type="number" name="headCircumference" value={growthData.headCircumference} onChange={handleChange} step="0.1" placeholder="e.g., 45.2" />
                  {formErrors.headCircumference && <span className="form-error">{formErrors.headCircumference}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="upperArmCircumference">Upper Arm Circumference (cm):</label>
                  <input id="upperArmCircumference" type="number" name="upperArmCircumference" value={growthData.upperArmCircumference} onChange={handleChange} step="0.1" placeholder="e.g., 15.1" />
                  {formErrors.upperArmCircumference && <span className="form-error">{formErrors.upperArmCircumference}</span>}
                </div>
                 <div className="form-group full-width"> {/* Make recordedBy full width */}
                  <label htmlFor="recordedByUser">Recorded By:</label>
                  <input id="recordedByUser" type="text" name="recordedByUser" value={growthData.recordedByUser} onChange={handleChange} placeholder="Enter name of recorder" />
                  {formErrors.recordedByUser && <span className="form-error">{formErrors.recordedByUser}</span>}
                </div>
              </div> {/* End Form Container */}
              <div className="form-group full-width"> {/* Notes field */}
                <label htmlFor="notes">Notes:</label>
                <textarea id="notes" name="notes" value={growthData.notes} onChange={handleChange} rows="3" placeholder="Add any additional notes (optional)" />
                {/* No error display usually needed for optional notes */}
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Submit Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )} {/* End Modal */}

      <Footer />
    </>
  );
};

export default UpdateGrowthMetrics;