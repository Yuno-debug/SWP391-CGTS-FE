import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ConsultationRequests.css';

const ConsultationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5200/api/ConsultationRequest/get-all', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });

        console.log("Consultation Requests Response:", response.data);

        if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
          setRequests(response.data.data.$values);
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Failed to load requests due to unexpected data format.");
        }
      } catch (error) {
        console.error('Error fetching consultation requests:', error);
        setError("Failed to load requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="consultation-requests-container">
      <h2>Consultation Requests</h2>
      <table className="consultation-requests-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Child ID</th>
            <th>Description</th>
            <th>Request Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={request.requestId || index}>
              <td>{request.requestId || 'N/A'}</td>
              <td>{request.childId || 'N/A'}</td>
              <td>{request.description || 'N/A'}</td>
              <td>{request.requestDate ? new Date(request.requestDate).toLocaleDateString() : 'N/A'}</td>
              <td>{request.status || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultationRequests;