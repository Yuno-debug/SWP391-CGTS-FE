import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ConsultationRequests.css';

const ConsultationRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
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
        }
      } catch (error) {
        console.error('Error fetching consultation requests:', error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="consultation-requests-container">
      <h2>Consultation Requests</h2>
      <table className="consultation-requests-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Child Name</th>
            <th>Parent Name</th>
            <th>Request Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.childName}</td>
              <td>{request.parentName}</td>
              <td>{new Date(request.requestDate).toLocaleDateString()}</td>
              <td>{request.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultationRequests;