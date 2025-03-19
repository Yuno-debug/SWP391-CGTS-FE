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
  const [alertTypeInputs, setAlertTypeInputs] = useState({});

  // States for Consultation Responses
  const [responses, setResponses] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [editResponseId, setEditResponseId] = useState(null);
  const [editResponseContent, setEditResponseContent] = useState('');
  const [editResponseDiagnosis, setEditResponseDiagnosis] = useState('');

  // States for Alerts
  const [alerts, setAlerts] = useState([]);
  const [editAlertId, setEditAlertId] = useState(null);
  const [editAlertMessage, setEditAlertMessage] = useState('');
  const [editAlertType, setEditAlertType] = useState('');

  // Common states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configurable endpoints
  const ALERT_ENDPOINT = 'http://localhost:5200/api/Alert';
  const CONSULTATION_RESPONSE_CREATE_ENDPOINT = 'http://localhost:5200/api/ConsultationResponse/create';
  const CONSULTATION_RESPONSE_UPDATE_ENDPOINT = 'http://localhost:5200/api/ConsultationResponse/update';
  const CONSULTATION_RESPONSE_DELETE_ENDPOINT = 'http://localhost:5200/api/ConsultationResponse/delete';
  const ALERT_UPDATE_ENDPOINT = 'http://localhost:5200/api/Alert';
  const ALERT_DELETE_ENDPOINT = 'http://localhost:5200/api/Alert';

  // Predefined alert types (Removed Consultation)
  const alertTypes = [
    { value: 'Emergency', label: 'Emergency' },
    { value: 'Follow-up', label: 'Follow-up' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const doctorResponse = await axios.get('http://localhost:5200/api/UserAccount/get-all', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (doctorResponse.data?.success && Array.isArray(doctorResponse.data?.data?.$values)) {
          const doctorMap = doctorResponse.data.data.$values
            .filter(user => user.role === 3)
            .reduce((acc, doctor) => {
              acc[doctor.id] = doctor.username;
              return acc;
            }, {});
          setDoctors(doctorMap);
        }

        const requestResponse = await axios.get('http://localhost:5200/api/ConsultationRequest/get-all', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
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
            acc[request.requestId] = 'Emergency'; // Default to Emergency instead of Consultation
            return acc;
          }, {}));
        } else {
          setError("Failed to load requests due to unexpected data format.");
        }

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
        } else {
          setError("Failed to load responses due to unexpected data format.");
        }

        const alertResponse = await axios.get('http://localhost:5200/api/Alert', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (alertResponse.data?.$values && Array.isArray(alertResponse.data.$values)) {
          setAlerts(alertResponse.data.$values);
        } else if (Array.isArray(alertResponse.data)) {
          setAlerts(alertResponse.data);
        } else {
          setError("Failed to load alerts due to unexpected data format.");
        }
      } catch (error) {
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
      if (!token) return null;

      const decodedToken = jwtDecode(token);
      const doctorId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
                      decodedToken['nameid'] ||
                      decodedToken['sub'] ||
                      decodedToken['DoctorId'];

      if (!doctorId || isNaN(parseInt(doctorId, 10))) return null;
      return parseInt(doctorId, 10);
    } catch (error) {
      return null;
    }
  };

  const handleSendAlert = async (requestId, childId) => {
    const alertMessage = alertInputs[requestId]?.trim();
    const alertType = alertTypeInputs[requestId] || 'Emergency'; // Default to Emergency
    if (!alertMessage) {
      alert('Please enter an alert message.');
      return;
    }

    try {
      const response = await axios.post(
        ALERT_ENDPOINT,
        {
          childId,
          alertType,
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
      alert('Alert sent successfully!');
      setAlertInputs((prev) => ({
        ...prev,
        [requestId]: '',
      }));
      const alertResponse = await axios.get('http://localhost:5200/api/Alert', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (alertResponse.data?.$values && Array.isArray(alertResponse.data.$values)) {
        setAlerts(alertResponse.data.$values);
      }
    } catch (error) {
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

    const doctorId = getDoctorIdFromToken() || 1;
    if (!doctorId) {
      alert('Failed to determine DoctorId. Please ensure you are logged in correctly.');
      return;
    }

    const status = 'Active';

    try {
      const payload = {
        requestId: parseInt(requestId),
        DoctorId: doctorId,
        Content: responseText,
        responseDate: new Date().toISOString(),
        status,
        diagnosis: diagnosis || '',
      };
      const response = await axios.post(
        CONSULTATION_RESPONSE_CREATE_ENDPOINT,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Response sent successfully!');
      setResponseInputs((prev) => ({
        ...prev,
        [requestId]: '',
      }));
      setDiagnosisInputs((prev) => ({
        ...prev,
        [requestId]: '',
      }));
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
      alert(`Failed to send response. Status: ${error.response?.status || 'Unknown'}, Message: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditResponse = (response) => {
    setEditResponseId(response.responseId);
    setEditResponseContent(response.content || '');
    setEditResponseDiagnosis(response.diagnosis || '');
  };

  const handleUpdateResponse = async (responseId) => {
    if (!editResponseContent.trim()) {
      alert('Response content cannot be empty.');
      return;
    }

    try {
      const payload = {
        Content: editResponseContent,
        diagnosis: editResponseDiagnosis || '',
        status: 'Active',
      };
      const response = await axios.put(
        `${CONSULTATION_RESPONSE_UPDATE_ENDPOINT}/${responseId}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Response updated successfully!');
      setEditResponseId(null);
      setEditResponseContent('');
      setEditResponseDiagnosis('');
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
      alert('Failed to update response. Please try again.');
    }
  };

  const handleDeleteResponse = async (responseId) => {
    if (!window.confirm('Are you sure you want to delete this response?')) return;

    try {
      await axios.delete(`${CONSULTATION_RESPONSE_DELETE_ENDPOINT}/${responseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert('Response deleted successfully!');
      setResponses(responses.filter(res => res.responseId !== responseId));
    } catch (error) {
      alert('Failed to delete response. Please try again.');
    }
  };

  const handleEditAlert = (alert) => {
    setEditAlertId(alert.alertId);
    setEditAlertMessage(alert.message || '');
    setEditAlertType(alert.alertType || 'Emergency'); // Default to Emergency
  };

  const handleUpdateAlert = async (alertId) => {
    if (!editAlertMessage.trim()) {
      alert('Alert message cannot be empty.');
      return;
    }

    try {
      const payload = {
        alertType: editAlertType,
        message: editAlertMessage,
        isRead: false,
      };
      const response = await axios.put(
        `${ALERT_UPDATE_ENDPOINT}/${alertId}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Alert updated successfully!');
      setEditAlertId(null);
      setEditAlertMessage('');
      setEditAlertType('');
      const alertResponse = await axios.get('http://localhost:5200/api/Alert', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (alertResponse.data?.$values && Array.isArray(alertResponse.data.$values)) {
        setAlerts(alertResponse.data.$values);
      }
    } catch (error) {
      alert('Failed to update alert. Please try again.');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;

    try {
      await axios.delete(`${ALERT_DELETE_ENDPOINT}/${alertId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert('Alert deleted successfully!');
      setAlerts(alerts.filter(alert => alert.alertId !== alertId));
    } catch (error) {
      alert('Failed to delete alert. Please try again.');
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
                    <div className="alert-type-wrapper">
                      <label htmlFor={`alert-type-${request.requestId}`} className="alert-type-label">
                        Alert Type:
                      </label>
                      <select
                        id={`alert-type-${request.requestId}`}
                        value={alertTypeInputs[request.requestId] || 'Emergency'}
                        onChange={(e) => handleInputChange(request.requestId, e.target.value, 'alertType')}
                        className="alert-type-select"
                      >
                        {alertTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      value={alertInputs[request.requestId] || ''}
                      onChange={(e) => handleInputChange(request.requestId, e.target.value, 'alert')}
                      placeholder="Enter alert message..."
                      className="action-input"
                    />
                    <button
                      onClick={() => handleSendAlert(request.requestId, request.childId)}
                      className="action-button"
                    >
                      Send Alert
                    </button>
                    <input
                      type="text"
                      value={responseInputs[request.requestId] || ''}
                      onChange={(e) => handleInputChange(request.requestId, e.target.value, 'response')}
                      placeholder="Enter response..."
                      className="action-input"
                    />
                    <input
                      type="text"
                      value={diagnosisInputs[request.requestId] || ''}
                      onChange={(e) => handleInputChange(request.requestId, e.target.value, 'diagnosis')}
                      placeholder="Enter diagnosis..."
                      className="action-input"
                    />
                    <button onClick={() => handleSendResponse(request.requestId)} className="action-button">
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {responses.length > 0 ? (
            responses.map((response, index) => (
              <tr key={response.responseId || index}>
                <td>{response.responseId || 'N/A'}</td>
                <td>{response.requestId || 'N/A'}</td>
                <td>{doctors[response.doctorId] || response.doctorId || 'N/A'}</td>
                <td>
                  {editResponseId === response.responseId ? (
                    <input
                      type="text"
                      value={editResponseContent}
                      onChange={(e) => setEditResponseContent(e.target.value)}
                      className="action-input"
                    />
                  ) : (
                    response.content || 'N/A'
                  )}
                </td>
                <td>{response.status || 'N/A'}</td>
                <td>
                  {editResponseId === response.responseId ? (
                    <input
                      type="text"
                      value={editResponseDiagnosis}
                      onChange={(e) => setEditResponseDiagnosis(e.target.value)}
                      className="action-input"
                    />
                  ) : (
                    response.diagnosis || 'N/A'
                  )}
                </td>
                <td>
                  {editResponseId === response.responseId ? (
                    <button onClick={() => handleUpdateResponse(response.responseId)} className="action-button">
                      Save
                    </button>
                  ) : (
                    <button onClick={() => handleEditResponse(response)} className="action-button">
                      Edit
                    </button>
                  )}
                  <button onClick={() => handleDeleteResponse(response.responseId)} className="action-button delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No responses available.</td>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <tr key={alert.alertId || index}>
                <td>{alert.childId || 'N/A'}</td>
                <td>
                  {editAlertId === alert.alertId ? (
                    <select
                      value={editAlertType}
                      onChange={(e) => setEditAlertType(e.target.value)}
                      className="alert-type-select"
                    >
                      {alertTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    alert.alertType || 'N/A'
                  )}
                </td>
                <td>
                  {editAlertId === alert.alertId ? (
                    <input
                      type="text"
                      value={editAlertMessage}
                      onChange={(e) => setEditAlertMessage(e.target.value)}
                      className="action-input"
                    />
                  ) : (
                    alert.message || 'N/A'
                  )}
                </td>
                <td>{alert.isRead ? 'Yes' : 'No'}</td>
                <td>{alert.alertDate ? new Date(alert.alertDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                  {editAlertId === alert.alertId ? (
                    <button onClick={() => handleUpdateAlert(alert.alertId)} className="action-button">
                      Save
                    </button>
                  ) : (
                    <button onClick={() => handleEditAlert(alert)} className="action-button">
                      Edit
                    </button>
                  )}
                  <button onClick={() => handleDeleteAlert(alert.alertId)} className="action-button delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No alerts available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultationRequests;