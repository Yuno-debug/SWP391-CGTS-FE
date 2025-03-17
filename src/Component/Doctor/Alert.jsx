import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Alert.css';

const Alert = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        setError("No authorization token found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5200/api/Alert', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("Alert Response (Stringified):", JSON.stringify(response.data, null, 2));

        // Handle the response format { "$id": "1", "$values": [...] }
        if (response.data?.$values && Array.isArray(response.data.$values)) {
          setAlerts(response.data.$values);
        } else if (Array.isArray(response.data)) {
          setAlerts(response.data);
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          setAlerts(response.data.data);
        } else if (response.data?.results && Array.isArray(response.data.results)) {
          setAlerts(response.data.results);
        } else if (response.data?.items && Array.isArray(response.data.items)) {
          setAlerts(response.data.items);
        } else if (response.data?.alerts && Array.isArray(response.data.alerts)) {
          setAlerts(response.data.alerts);
        } else if (response.data?.success === false) {
          setError(`API Error: ${response.data.message || "No alerts available"}`);
        } else if (response.data === null || Object.keys(response.data).length === 0) {
          setError("No alerts data received. The response is empty.");
        } else {
          console.error("Unexpected response format:", JSON.stringify(response.data, null, 2));
          setError("Invalid response format. Expected an array or object with an array property.");
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
        let errorMessage = "Failed to load alerts.";
        if (error.response) {
          errorMessage += ` Server responded with: ${error.response.status} - ${error.response.data?.message || "Bad Request"}`;
        } else if (error.request) {
          errorMessage += " No response received from the server.";
        } else {
          errorMessage += ` Error: ${error.message}`;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="alert-container">
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
              <tr key={alert.alertId || index}> {/* Use alertId as a unique key */}
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

export default Alert;