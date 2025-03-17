import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ConsultationResponses.css';

const ConsultationResponse = () => {
  const [responses, setResponses] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5200/api/UserAccount/get-all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}` // Fixed syntax
        }
      });

      console.log("Doctors Response:", response.data);

      if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
        const doctorMap = response.data.data.$values
          .filter(user => user.role === 3) // Assuming role 3 is Doctor
          .reduce((acc, doctor) => {
            acc[doctor.id] = doctor.username; // Map doctorId to username
            return acc;
          }, {});
        setDoctors(doctorMap);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchResponses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5200/api/ConsultationResponse/get-all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}` // Fixed syntax
        }
      });

      console.log("Consultation Responses Response:", response.data);

      if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
        setResponses(response.data.data.$values);
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Invalid response format. Expected an array of responses in data.$values.");
      }
    } catch (error) {
      console.error('Error fetching consultation responses:', error);
      setError(`Failed to load consultation responses: ${error.response?.status ? `Error ${error.response.status}` : error.message}`); // Fixed syntax
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDoctors(); // Fetch doctors first
      await fetchResponses(); // Then fetch responses
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (error) return (
    <div>
      <p>{error}</p>
      <button onClick={fetchResponses} style={{ marginTop: '10px' }}>
        Retry
      </button>
    </div>
  );

  return (
    <div className="consultation-response-container">
      <h2>Consultation Responses</h2>
      <table className="consultation-response-table">
        <thead>
          <tr>
            <th>Response ID</th>
            <th>Request ID</th>
            <th>Doctor</th>
            <th>Response Content</th>
            <th>Status</th>
            <th>Diagnosis</th>
          </tr>
        </thead>
        <tbody>
          {responses.length > 0 ? (
            responses.map((response, index) => (
              <tr key={response.responseId || index}>
                <td>{response.responseId || 'N/A'}</td>
                <td>{response.requestId || 'N/A'}</td>
                <td>{doctors[response.doctorId] || response.doctorId || 'N/A'}</td>
                <td>{response.content || 'N/A'}</td>
                <td>{response.status || 'N/A'}</td>
                <td>{response.diagnosis || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No responses available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultationResponse;
