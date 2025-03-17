import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './ConsultationRequests.css';

const ConsultationRequests = () => {
  // States for Consultation Requests
  const [requests, setRequests] = useState([]);
  const [responseInputs, setResponseInputs] = useState({});
  const [alertInputs, setAlertInputs] = useState({});
  const [diagnosisInputs, setDiagnosisInputs] = useState({});
  const [alertTypeInputs, setAlertTypeInputs] = useState({}); // New state for alert types

  // States for Consultation Responses
  const [responses, setResponses] = useState([]);
  const [doctors, setDoctors] = useState({});

  // States for Alerts
  const [alerts, setAlerts] = useState([]);

  // Common states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configurable endpoints
  const ALERT_ENDPOINT = 'http://localhost:5200/api/Alert';
  const CONSULTATION_RESPONSE_ENDPOINT = 'http://localhost:5200/api/ConsultationResponse/create';

  // Predefined alert types
  const alertTypes = [
    { value: 'Consultation', label: 'Consultation' },
    { value: 'Emergency', label: 'Emergency' },
    { value: 'Follow-up', label: 'Follow-up' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch Doctors
        const doctorResponse = await axios.get('http://localhost:5200/api/UserAccount/get-all', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        console.log("Doctors Response:", doctorResponse.data);
        if (doctorResponse.data?.success && Array.isArray(doctorResponse.data?.data?.$values)) {
          const doctorMap = doctorResponse.data.data.$values
            .filter(user => user.role === 3)
            .reduce((acc, doctor) => {
              acc[doctor.id] = doctor.username;
              return acc;
            }, {});
          setDoctors(doctorMap);
        }

        // Fetch Consultation Requests
        const requestResponse = await axios.get('http://localhost:5200/api/ConsultationRequest/get-all', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        console.log("Consultation Requests Response:", JSON.stringify(requestResponse.data, null, 2));
        if (requestResponse.data?.success && Array.isArray(requestResponse.data?.data?.$values)) {
          setRequests(requestResponse.data.data.$values);
          const initialInputs = requestResponse.data.data.$values.reduce((acc, request) => {
            acc[request.requestId] = '';
            return acc;
          }, {});
          setResponseInputs(initialInputs);
          setAlertInputs(initialInputs);
          setDiagnosisInputs(initialInputs);
          setAlertTypeInputs(requestResponse.data.data.$values.reduce((acc, request) => {
            acc[request.requestId] = 'Consultation'; // Default alert type
            return acc;
          }, {})); // Initialize alert types
        } else {
          setError("Failed to load requests due to unexpected data format.");
        }

        // Fetch Consultation Responses
        const responseResponse = await axios.get('http://localhost:5200/api/ConsultationResponse/get-all', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        console.log("Consultation Responses Response:", responseResponse.data);
        if (responseResponse.data?.success && Array.isArray(responseResponse.data?.data?.$values)) {
          setResponses(responseResponse.data.data.$values.map(res => ({
            ...res,
            content: res.Content || res.content,
          })));
        } else {
          setError("Failed to load responses due to unexpected data format.");
        }

        // Fetch Alerts
        const alertResponse = await axios.get('http://localhost:5200/api/Alert', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        console.log("Alert Response:", JSON.stringify(alertResponse.data, null, 2));
        if (alertResponse.data?.$values && Array.isArray(alertResponse.data.$values)) {
          setAlerts(alertResponse.data.$values);
        } else if (Array.isArray(alertResponse.data)) {
          setAlerts(alertResponse.data);
        } else {
          setError("Failed to load alerts due to unexpected data format.");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to load data: ${error.response?.status ? `Error ${error.response.status}` : error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (requestId, value, type) => {
    if (type === 'alert') {
      setAlertInputs((prev) => ({
        ...prev,
        [requestId]: value,
      }));
    } else if (type === 'response') {
      setResponseInputs((prev) => ({
        ...prev,
        [requestId]: value,
      }));
    } else if (type === 'diagnosis') {
      setDiagnosisInputs((prev) => ({
        ...prev,
        [requestId]: value,
      }));
    } else if (type === 'alertType') {
      setAlertTypeInputs((prev) => ({
        ...prev,
        [requestId]: value,
      }));
    }
  };

  const getDoctorIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      console.log('Raw Token:', token);
      if (!token) {
        console.error('No token found in localStorage');
        return null;
      }

      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);

      const doctorId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
                      decodedToken['nameid'] ||
                      decodedToken['sub'] ||
                      decodedToken['DoctorId'];

      if (!doctorId || isNaN(parseInt(doctorId, 10))) {
        console.error('DoctorId not found or not a number in token claims:', doctorId);
        return null;
      }

      return parseInt(doctorId, 10);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleSendAlert = async (requestId, childId) => {
    const alertMessage = alertInputs[requestId]?.trim();
    const alertType = alertTypeInputs[requestId] || 'Consultation'; // Default to 'Consultation' if not selected
    if (!alertMessage) {
      alert('Please enter an alert message.');
      return;
    }

    try {
      const response = await axios.post(
        ALERT_ENDPOINT,
        {
          childId,
          alertType, // Include the selected alert type
          message: alertMessage,
          isRead: false,
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Alert sent - Request:', JSON.stringify(response.config, null, 2));
      console.log('Alert sent - Response:', JSON.stringify(response.data, null, 2));
      alert('Alert sent successfully!');
      setAlertInputs((prev) => ({
        ...prev,
        [requestId]: '',
      }));
      // Refresh alerts
      const alertResponse = await axios.get('http://localhost:5200/api/Alert', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (alertResponse.data?.$values && Array.isArray(alertResponse.data.$values)) {
        setAlerts(alertResponse.data.$values);
      }
    } catch (error) {
      console.error('Error sending alert:', error.response ? error.response.data : error.message);
      alert('Failed to send alert. Please try again.');
    }
  };

  const handleSendResponse = async (requestId) => {
    const responseText = responseInputs[requestId]?.trim();
    const diagnosis = diagnosisInputs[requestId]?.trim();
    if (!responseText) {
      alert('Please enter a response message.');
      return;
    }

    const doctorId = getDoctorIdFromToken() || 1; // Fallback to 1
    if (!doctorId) {
      alert('Failed to determine DoctorId. Please ensure you are logged in correctly.');
      return;
    }

    const status = 'Active';

    try {
      const payload = {
        requestId: parseInt(requestId),
        DoctorId: doctorId,
        Content: responseText, // Changed from responseContent to Content
        responseDate: new Date().toISOString(),
        status,
        diagnosis: diagnosis || '', // Optional, defaults to empty if not provided
      };
      console.log('Sending Response Payload:', JSON.stringify(payload, null, 2)); // Debug payload

      const response = await axios.post(
        CONSULTATION_RESPONSE_ENDPOINT,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response sent - Request:', JSON.stringify(response.config.data, null, 2));
      console.log('Response sent - Full Response:', JSON.stringify(response.data, null, 2));
      alert('Response sent successfully!');
      setResponseInputs((prev) => ({
        ...prev,
        [requestId]: '',
      }));
      setDiagnosisInputs((prev) => ({
        ...prev,
        [requestId]: '',
      }));
      // Refresh responses
      const responseResponse = await axios.get('http://localhost:5200/api/ConsultationResponse/get-all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (responseResponse.data?.success && Array.isArray(responseResponse.data?.data?.$values)) {
        setResponses(responseResponse.data.data.$values.map(res => ({
          ...res,
          content: res.Content || res.content,
        })));
      }
    } catch (error) {
      console.error('Error sending response:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      alert(`Failed to send response. Status: ${error.response?.status || 'Unknown'}, Message: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="consultation-requests-container">
      {/* Consultation Requests Section */}
      <h2>Consultation Requests</h2>
      <table className="consultation-requests-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Child ID</th>
            <th>Description</th>
            <th>Request Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.requestId}>
                <td>{request.requestId || 'N/A'}</td>
                <td>{request.childId || 'N/A'}</td>
                <td>{request.description || 'N/A'}</td>
                <td>{request.requestDate ? new Date(request.requestDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div className="action-container">
                    <select
                      value={alertTypeInputs[request.requestId] || 'Consultation'}
                      onChange={(e) => handleInputChange(request.requestId, e.target.value, 'alertType')}
                      style={{ marginRight: '10px', padding: '5px', width: '150px' }}
                    >
                      {alertTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={alertInputs[request.requestId] || ''}
                      onChange={(e) => handleInputChange(request.requestId, e.target.value, 'alert')}
                      placeholder="Enter alert message..."
                      style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <button
                      onClick={() => handleSendAlert(request.requestId, request.childId)}
                      style={{ marginRight: '10px' }}
                    >
                      Send Alert
                    </button>
                    <input
                      type="text"
                      value={responseInputs[request.requestId] || ''}
                      onChange={(e) => handleInputChange(request.requestId, e.target.value, 'response')}
                      placeholder="Enter response..."
                      style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <input
                      type="text"
                      value={diagnosisInputs[request.requestId] || ''}
                      onChange={(e) => handleInputChange(request.requestId, e.target.value, 'diagnosis')}
                      placeholder="Enter diagnosis..."
                      style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <button onClick={() => handleSendResponse(request.requestId)}>
                      Send Response
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No requests available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Consultation Responses Section */}
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

      {/* Alerts Section */}
      <h2>Alerts</h2>
      <table className="alert-table">
        <thead>
          <tr>
            <th>Child ID</th>
            <th>Alert Type</th>
            <th>Message</th>
            <th>Is Read</th>
            <th>Alert Date</th>
          </tr>
        </thead>
        <tbody>
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <tr key={alert.alertId || index}>
                <td>{alert.childId || 'N/A'}</td>
                <td>{alert.alertType || 'N/A'}</td>
                <td>{alert.message || 'N/A'}</td>
                <td>{alert.isRead ? 'Yes' : 'No'}</td>
                <td>{alert.alertDate ? new Date(alert.alertDate).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No alerts available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultationRequests;